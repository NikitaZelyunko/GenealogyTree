<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as d3 from 'd3'; // TODO переделать на конкретные импорты
import {flareJson} from './flare';
import type { CurveFactory, HierarchyNode, ClusterLayout, TreeLayout, Selection as D3Selection } from 'd3';

// Базовый пример взял отсюда: https://observablehq.com/@d3/tree-component
const treeRoot = ref<HTMLElement | null>(null);

type Tree = {
  name: string;
  children?: Tree[];
}

/**
 * Получение минимальных и максимальных границ координат точек дерева
 */
function getCoordinateRanges<Datum extends Tree>(root: HierarchyNode<Datum>) {
  let x0 = Infinity;
  let x1 = -x0;
  let y0 = Infinity;
  let y1 = -y0;
  root.each(d => {
    const { x, y } = d;
    if(typeof x === 'number') {
      if (x > x1) x1 = x;
      if (x < x0) x0 = x;
    }

    if(typeof y === 'number') {
      if (y > y1) y1 = y;
      if (y < y0) y0 = y;
    }
  });
  return {
    x0, x1,
    y0, y1
  }
}


type Config<Datum extends Tree> = {
  mode: 'horizontal' | 'vertical',
  path: Parameters<d3.StratifyOperator<Datum>['path']>[0]; // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id: (<D extends {id?: string}>(d: D, index: number, data: D[]) => string | undefined) | null; // if tabular data, given a d in data, returns a unique identifier (string)
  parentId: ((d: {parentId?: string}) => string | undefined) | null; // if tabular data, given a node d, returns its parent’s identifier
  children: Parameters<typeof d3.hierarchy<Datum>>[1]; // if hierarchical data, given a d in data, returns its children
  tree: () => TreeLayout<Datum> | ClusterLayout<Datum>; // TODO здесь могут быть любые layout для древовидных структур;// layout algorithm (typically d3.tree or d3.cluster)
  sort: (a: HierarchyNode<Datum>, b: HierarchyNode<Datum>) => number;// how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label: (nodeData: any, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, returns the display name
  title: (nodeData: any, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, returns its hover text
  link: (nodeData: any, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, its link (if any)
  linkTarget: string;// the target attribute for links (if any)
  width: number;// outer width, in pixels
  height: number;// outer height, in pixels
  dx: number; // Расстояние между узлами на одном уровне по ширине/высоте в зависимости от mode
  dy: number; // Расстояние между узлами на одном уровне по высоте/ширине в зависимости от mode
  radius: number;// radius of nodes
  padding: number;// horizontal padding for first and last column
  fill: string;// fill for nodes
  stroke: string;// stroke for links
  strokeWidth: number;// stroke width for links
  strokeOpacity: number;
  strokeLinejoin: string;// stroke line join for links
  strokeLinecap: string;// stroke line cap for links
  halo: string;// color of label halo 
  haloWidth: number;// padding around the labels
  curve: CurveFactory// curve for the link
}

function Tree<Datum extends Tree>(
  data: Datum, // data is either tabular (array of objects) or hierarchy (nested objects)
{
  mode = 'horizontal',
  path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id = Array.isArray(data) ? d => d.id : undefined, // if tabular data, given a d in data, returns a unique identifier (string)
  parentId = Array.isArray(data) ? d => d.parentId : undefined, // if tabular data, given a node d, returns its parent’s identifier
  children, // if hierarchical data, given a d in data, returns its children
  tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
  sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label, // given a node d, returns the display name
  title, // given a node d, returns its hover text
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links (if any)
  width, // outer width, in pixels
  height, // outer height, in pixels
  dx = 200,
  dy = 200,
  radius = 3, // radius of nodes
  padding = 1, // horizontal padding for first and last column
  fill = "#999", // fill for nodes
  stroke = "#555", // stroke for links
  strokeWidth = 1.5, // stroke width for links
  strokeOpacity = 0.4, // stroke opacity for links
  strokeLinejoin = '', // stroke line join for links
  strokeLinecap = '', // stroke line cap for links
  halo = "#fff", // color of label halo 
  haloWidth = 3, // padding around the labels
  // curve = d3.curveStepAfter, // ребра с прямыми углами
  // curve = d3.curveLinear, // Линейные ребра(прямая линия от одной точки до другой)
  // curve = d3.curveBumpX, // скругленные ребра (радиус скругления похоже как-то зависит от x)
  // curve = d3.curveBumpY, // скругленные ребра (радиус скругления похоже как-то зависит от y)
  curve = d3.curveBumpX, // curve for the link
}: Partial<Config<Datum>> ) {

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  let root: HierarchyNode<Datum>;

  if(path || id || parentId) {
    const stratifyOperator = d3.stratify<Datum & {id?: string; parentId?: string}>();
  
    if(path) {
      stratifyOperator.path(path);
    }

    if(id) {
      stratifyOperator.id(id);
    }

    if(parentId) {
      stratifyOperator.parentId(parentId);
    }

    root = stratifyOperator(data as unknown as (Datum & {id?: string; parentId?: string})[]);
  } else {
    // В данный момент используется только эта ветка
    root = d3.hierarchy(data, children);
  }

  // Sort the nodes.
  if(sort) {
    root.sort(sort);
  }


  /**
   * Массив узлов дерева. Порядок определяется по слоям, т.е.
   * Сначала идет корень дерева, потом по очереди его дети, затем по очереди дети детей.
   * Пример:
   * Parent0 -> [Child0, Child1],
   * Child0 -> [Child00, Child01, Child02],
   * Child1 -> [Child10, Child11],
   * Child00 -> [Child000, Child001]
   * Child11 -> [Child110].
   * Порядок в descendants будет следующий:
   * [Parent0, Child0, Child1, Child00, Child01, Child02, Child10, Child11, Child000, Child001, Child110]
   */
  const descendants = root.descendants();
  // Compute labels and titles.
  const L = label == null ? null : descendants.map(d => label(d.data, d));

  // Compute the layout.
  if(mode === 'horizontal') {
    tree().nodeSize([dy, dx])(root); 
  } else {
    tree().nodeSize([dx, dy])(root); 
  }

  // Center the tree.
  const {x0, x1, y0, y1} = getCoordinateRanges(root);

  // Compute the default height.
  // Отступ по ширине от границ дерева(узлы и ребра) до границ viewbox
  const viewboxXPadding = 20;
  // Отступ по высоте от границ дерева(узлы и ребра) до границ viewbox
  const viewboxYPadding = 20;

  // Compute the default height.
  if(height === undefined) {
    if(mode === 'horizontal') {
      height = x1 - x0 + viewboxXPadding * 2;
    } else {
      height = y1 - y0 + viewboxYPadding * 2;
    }
  }

  // Compute the default width.
  if(width === undefined) {
    if(mode === 'horizontal') {
      width = y1 - y0 + viewboxYPadding * 2;
    } else {
      width = x1 - x0 + viewboxXPadding * 2;
    }
  }


  let minXViewBox: number;
  if(mode === 'horizontal') {
    minXViewBox = y0 - viewboxYPadding;
  } else {
    minXViewBox = x0 - viewboxXPadding;
  }

  let minYViewBox: number;
  if(mode === 'horizontal') {
    minYViewBox = x0 - viewboxXPadding;
  } else {
    minYViewBox = y0 - viewboxYPadding;
  }

  const svg = d3.create('svg');
  svg
      .attr("viewBox", [minXViewBox, minYViewBox, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const dLink = d3.link<d3.HierarchyLink<Datum>, HierarchyNode<Datum>>(curve);
  
  function getConfiguredLinkCoordinates() {
    if(mode === 'horizontal') {
      return dLink.x(d => {
              return d.y ?? 0;
            })
            .y(d => {
              return  d.x ?? 0;
            })
    } else {
      return dLink.x(d => {
              return d.x ?? 0;
            })
            .y(d => {
              return  d.y ?? 0;
            })
    }
  }
  
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", getConfiguredLinkCoordinates());

  let nodeTransform: (d: HierarchyNode<Datum>) => string;  
    
  if(mode === 'horizontal') {
    nodeTransform = d => `translate(${d.y},${d.x})`;
  } else {
    nodeTransform = d => `translate(${d.x},${d.y})`;
  }
  const node = svg.append("g")
    .selectAll("a")
    .data(root.descendants())
    .join("a")
      .attr("xlink:href", link == null ? null : d => link(d.data, d))
      .attr("target", link == null ? null : linkTarget)
      .attr("transform", nodeTransform);

  node.append("circle")
      .attr("fill", d => d.children ? stroke : fill)
      .attr("r", radius);

  if (title != null) node.append("title")
      .text(d => title(d.data, d));

  if (L) node.append("text")
      .attr("dy", "0.32em")
      // .attr("x", d => d.children ? -6 : 6)
      .attr("y", (d) => 10)
      // .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("text-anchor", d => "middle")
      .attr("paint-order", "stroke")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth)
      .text((d, i) => L[i]);

  return svg.node();
}

function createTree() {

const genealogy = {
  name: "Eve",
  children: [
    {name: "Cain"},
    {name: "Seth", children: [{name: "Enos"}, {name: "Noam"}]},
    {name: "Abel"},
    {name: "Awan", children: [{name: "Enoch"}]},
    {name: "Azura"}
  ]
};

const flare = flareJson;
const chart = Tree(genealogy, {
  mode: 'vertical',
  label: d => d.name,
  title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
  link: (d, n) => `https://github.com/prefuse/Flare/${n.children ? "tree" : "blob"}/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}${n.children ? "" : ".as"}`,
  // width: 1000,
  // height: 1000
});

return chart;

}

onMounted(() => {
  const treeContainer = treeRoot.value;
  if(!treeContainer) {
    return;
  }
  const tree = createTree();
  if(!tree) {
    return;
  }

  treeContainer.append(tree);
})


</script>

<template>
  <div class="tree-view-wrapper" ref="treeRoot"></div>
</template>

<style scoped>
.tree-view-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
