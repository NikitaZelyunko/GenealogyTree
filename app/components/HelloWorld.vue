<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as d3 from 'd3'; // TODO переделать на конкретные импорты
// import { flareJson } from './flare';
import type {
  CurveFactory,
  HierarchyNode,
  ClusterLayout,
  TreeLayout,
  HierarchyLink,
} from 'd3';
import type { TTree } from './tree';
import { RomanovTreePrepared } from './romanov-tree-prepared';
import { getRomanovTreeStructure } from './romanov-tree';

// Базовый пример взял отсюда: https://observablehq.com/@d3/tree-component
const treeRoot = ref<HTMLElement | null>(null);

type TreeHierarchyConfig<Datum extends TTree> = {
  path: Parameters<d3.StratifyOperator<Datum>['path']>[0]; // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id:
    | (<D extends { id?: string }>(
        d: D,
        index: number,
        data: D[],
      ) => string | undefined)
    | null; // if tabular data, given a d in data, returns a unique identifier (string)
  parentId: ((d: { parentId?: string }) => string | undefined) | null; // if tabular data, given a node d, returns its parent’s identifier
  children: Parameters<typeof d3.hierarchy<Datum>>[1]; // if hierarchical data, given a d in data, returns its children
};

type Config<Datum extends TTree> = {
  mode: 'horizontal' | 'vertical';
  treeHierarchyConfig: TreeHierarchyConfig<Datum>;
  tree: () => TreeLayout<Datum> | ClusterLayout<Datum>; // TODO здесь могут быть любые layout для древовидных структур;// layout algorithm (typically d3.tree or d3.cluster)
  sort: (a: HierarchyNode<Datum>, b: HierarchyNode<Datum>) => number; // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label: (nodeData: Datum, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, returns the display name
  title: (nodeData: Datum, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, returns its hover text
  link: (nodeData: Datum, node: HierarchyNode<Datum>) => string; // TODO тут вместо string могут быть number, boolean и т.д// given a node d, its link (if any)
  linkTarget: string; // the target attribute for links (if any)
  width: number; // outer width, in pixels
  height: number; // outer height, in pixels
  dx: number; // Расстояние между узлами на одном уровне по ширине/высоте в зависимости от mode
  dy: number; // Расстояние между узлами на одном уровне по высоте/ширине в зависимости от mode
  radius: number; // radius of nodes
  fill: string; // fill for nodes
  stroke: string; // stroke for links
  strokeWidth: number; // stroke width for links
  strokeOpacity: number;
  strokeLinejoin: string; // stroke line join for links
  strokeLinecap: string; // stroke line cap for links
  halo: string; // color of label halo
  haloWidth: number; // padding around the labels
  curve: CurveFactory; // curve for the link
};

/**
 * Получение минимальных и максимальных границ координат точек дерева
 */
function getCoordinateRanges<Datum extends TTree>(root: HierarchyNode<Datum>) {
  let x0 = Infinity;
  let x1 = -x0;
  let y0 = Infinity;
  let y1 = -y0;
  root.each((d) => {
    if (d.data.hidden) {
      return;
    }
    const { x, y } = d;
    if (typeof x === 'number') {
      if (x > x1) x1 = x;
      if (x < x0) x0 = x;
    }

    if (typeof y === 'number') {
      if (y > y1) y1 = y;
      if (y < y0) y0 = y;
    }
  });
  return {
    x0,
    x1,
    y0,
    y1,
  };
}

function createTreeRoot<Datum extends TTree>(
  data: Datum, // data is either tabular (array of objects) or hierarchy (nested objects),
  {
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? (d) => d.id : undefined, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? (d) => d.parentId : undefined, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
  }: Partial<TreeHierarchyConfig<Datum>>,
) {
  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  let root: HierarchyNode<Datum>;

  if (path || id || parentId) {
    const stratifyOperator = d3.stratify<
      Datum & { id?: string; parentId?: string }
    >();

    if (path) {
      stratifyOperator.path(path);
    }

    if (id) {
      stratifyOperator.id(id);
    }

    if (parentId) {
      stratifyOperator.parentId(parentId);
    }

    root = stratifyOperator(
      data as unknown as (Datum & { id?: string; parentId?: string })[],
    );
  } else {
    // В данный момент используется только эта ветка
    root = d3.hierarchy(data, children);
  }

  return root;
}

function Tree<Datum extends TTree>(
  data: Datum, // data is either tabular (array of objects) or hierarchy (nested objects)
  config: Partial<Config<Datum>>,
) {
  const {
    mode = 'horizontal',
    tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
    sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label, // given a node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    linkTarget = '_blank', // the target attribute for links (if any)
    width, // outer width, in pixels
    height, // outer height, in pixels
    dx = 200,
    dy = 200,
    radius = 3, // radius of nodes
    fill = '#999', // fill for nodes
    stroke = '#555', // stroke for links
    strokeWidth = 1.5, // stroke width for links
    strokeOpacity = 0.4, // stroke opacity for links
    strokeLinejoin = '', // stroke line join for links
    strokeLinecap = '', // stroke line cap for links
    halo = '#fff', // color of label halo
    haloWidth = 3, // padding around the labels
    // curve = d3.curveStepAfter, // ребра с прямыми углами
    // curve = d3.curveLinear, // Линейные ребра(прямая линия от одной точки до другой)
    // curve = d3.curveBumpX, // скругленные ребра (радиус скругления похоже как-то зависит от x)
    curve = d3.curveBumpY, // скругленные ребра (радиус скругления похоже как-то зависит от y)
    // curve = d3.curveBumpX, // curve for the link
  } = config;

  const root = createTreeRoot(data, config.treeHierarchyConfig ?? {});

  // Sort the nodes.
  if (sort) {
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
  const L = label == null ? null : descendants.map((d) => label(d.data, d));

  const treeElement = tree().separation((aNode, bNode) => {
    // if(aNode.data.name.length >=18) {
    //   return 1.1;
    // }
    // if(bNode.data.name.length >=18) {
    //   return 1.1;
    // }
    return 1;
  });

  let xNodeSize: number;
  let yNodeSize: number;

  if (mode === 'horizontal') {
    xNodeSize = dy;
    yNodeSize = dx;
  } else {
    xNodeSize = dx;
    yNodeSize = dy;
  }

  // Compute the layout.
  treeElement.nodeSize([xNodeSize, yNodeSize])(root);

  let currentDepth: number | undefined = undefined;
  let prevRightBorder: number | undefined = undefined;
  const perCharSize = 6;
  let maxRightBorder = Number.NEGATIVE_INFINITY;
  let minLeftBorder = Number.POSITIVE_INFINITY;

  let yOffset = 0;

  // TODO сделать за один проход дерева все операции(см getCoordinateRanges)
  root.each((node) => {
    const nameLength = node.data.name.length;
    const neededSpace = nameLength * perCharSize;
    const halfNeededSpace = Math.round(neededSpace / 2);

    if (currentDepth !== node.depth) {
      currentDepth = node.depth;
      maxRightBorder = Math.max(
        maxRightBorder,
        prevRightBorder ?? Number.NEGATIVE_INFINITY,
      );
      minLeftBorder = Math.min(
        minLeftBorder,
        Math.floor(node.x ?? 0 - halfNeededSpace),
      );
      prevRightBorder = undefined;

      // yOffset = (node.depth - 1) * Math.floor(yNodeSize / 4);
    }

    const nodeTextCenter = node.x ?? 0;
    const nodeTextLeftBorder = nodeTextCenter - halfNeededSpace;

    let leftOffset = 0;

    if (
      prevRightBorder !== undefined &&
      prevRightBorder >= nodeTextLeftBorder
    ) {
      leftOffset = prevRightBorder - nodeTextLeftBorder;
    }

    const notEnoughSpace =
      neededSpace > xNodeSize ? neededSpace - xNodeSize : 0;
    node.x = leftOffset + nodeTextCenter + Math.round(notEnoughSpace / 2);
    prevRightBorder = node.x + halfNeededSpace;

    node.y = (node.y ?? 0) - yOffset;
  });

  // Center the tree.
  let { x0, x1, y0, y1 } = getCoordinateRanges(root);

  if (x1 < maxRightBorder) {
    x1 = maxRightBorder;
  }

  if (x0 > minLeftBorder) {
    x0 = minLeftBorder;
  }

  // Compute the default height.
  // Отступ по ширине от границ дерева(узлы и ребра) до границ viewbox
  const viewboxXPadding = 40;
  // Отступ по высоте от границ дерева(узлы и ребра) до границ viewbox
  const viewboxYPadding = 20;

  // Compute the default height.
  let viewBoxHeight: number;
  if (height === undefined) {
    if (mode === 'horizontal') {
      viewBoxHeight = x1 - x0 + viewboxXPadding * 2;
    } else {
      viewBoxHeight = y1 - y0 + viewboxYPadding * 2;
    }
  } else {
    viewBoxHeight = height;
  }

  // Compute the default width.
  let viewBoxWidth: number;
  if (width === undefined) {
    if (mode === 'horizontal') {
      viewBoxWidth = y1 - y0 + viewboxYPadding * 2;
    } else {
      viewBoxWidth = x1 - x0 + viewboxXPadding * 2;
    }
  } else {
    viewBoxWidth = width;
  }

  let minXViewBox: number;
  if (mode === 'horizontal') {
    minXViewBox = y0 - viewboxYPadding;
  } else {
    minXViewBox = x0 - viewboxXPadding;
  }

  let minYViewBox: number;
  if (mode === 'horizontal') {
    minYViewBox = x0 - viewboxXPadding;
  } else {
    minYViewBox = y0 - viewboxYPadding;
  }

  const svg = d3.create('svg');
  svg
    .attr('viewBox', [minXViewBox, minYViewBox, viewBoxWidth, viewBoxHeight])
    .attr('width', viewBoxWidth)
    .attr('height', viewBoxHeight)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  const dLink = d3.link<d3.HierarchyLink<Datum>, HierarchyNode<Datum>>(curve);

  function getConfiguredLinkCoordinates(
    linkConfig: d3.Link<any, d3.HierarchyLink<Datum>, d3.HierarchyNode<Datum>>,
  ) {
    if (mode === 'horizontal') {
      return linkConfig
        .x((d) => {
          return d.y ?? 0;
        })
        .y((d) => {
          return d.x ?? 0;
        });
    } else {
      return linkConfig
        .x((d) => {
          return d.x ?? 0;
        })
        .y((d) => {
          return d.y ?? 0;
        });
    }
  }

  const nodes = root.descendants().filter((d) => {
    return !d.data.hidden;
  });

  const links = root.links().filter((d) => {
    return (
      !d.source.data.hidden &&
      !d.target.data.noParent &&
      d.target.data.type === 'person'
    );
  });

  const { marriagesNodes, personIdToNodeMap } = nodes.reduce<{
    marriagesNodes: d3.HierarchyNode<Datum>[];
    personIdToNodeMap: Record<number, d3.HierarchyNode<Datum>>;
  }>(
    (acc, node) => {
      if (node.data.type === 'person') {
        acc.personIdToNodeMap[node.data.data.personId] = node;
      } else if (node.data.type === 'marriage') {
        acc.marriagesNodes.push(node);
      }
      return acc;
    },
    { marriagesNodes: [], personIdToNodeMap: {} },
  );

  const personToMarriageLinks = marriagesNodes.reduce((acc, node) => {
    const marriageData = node.data.data.marriage;

    const { firstPersonId, secondPersonId } = marriageData;

    const firstPersonNode = personIdToNodeMap[firstPersonId];
    const secondPersonNode = personIdToNodeMap[secondPersonId];

    acc.push({
      source: firstPersonNode,
      target: node,
    });

    acc.push({
      source: secondPersonNode,
      target: node,
    });
    return acc;
  }, [] as d3.HierarchyLink<Datum>[]);

  // links.push(...personToMarriageLinks)

  // TODO в список узлов и ребер можно добавлять элементы.
  // TODO можно рисовать несколько разных узлов и несколько разных ребер разными способами

  // links.push({
  //   source: nodes[0],
  //   target: nodes[2],
  // });

  // links.push({
  //   source: nodes[0],
  //   target: nodes[1],
  // });

  const nodesContainer = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', stroke)
    .attr('stroke-opacity', strokeOpacity)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-width', strokeWidth);

  nodesContainer
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('d', getConfiguredLinkCoordinates(dLink));

  const marriageNodesContainer = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', stroke)
    .attr('stroke-opacity', strokeOpacity)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-width', strokeWidth);

  const createCurveBumpYWithOffset = function ({
    startOffset,
  }: {
    startOffset: number;
  }) {
    return (link: HierarchyLink<Datum>) => {
      const { x: sourceX = 0, y: sourceY = 0 } = link.source;
      const { x: targetX = 0, y: targetY = 0 } = link.target;
      const line = d3.line(
        (d) => d[0],
        (d) => d[1],
      );
      line.curve(curve);
      return line([
        [sourceX, sourceY],
        [sourceX, sourceY + startOffset],
        [targetX, targetY],
      ]);
    };
  };

  const toMarriageNodeCurve = createCurveBumpYWithOffset({ startOffset: 30 });
  marriageNodesContainer
    .selectAll('path')
    .data(personToMarriageLinks)
    .join('path')
    .attr('d', toMarriageNodeCurve);

  let nodeTransform: (d: HierarchyNode<Datum>) => string;

  if (mode === 'horizontal') {
    nodeTransform = (d) => `translate(${d.y},${d.x})`;
  } else {
    nodeTransform = (d) => `translate(${d.x},${d.y})`;
  }
  const node = svg
    .append('g')
    .selectAll('a')
    .data(nodes)
    .join('a')
    .attr('xlink:href', link == null ? null : (d) => link(d.data, d))
    .attr('target', link == null ? null : linkTarget)
    .attr('transform', nodeTransform);

  node
    .append('circle')
    .attr('fill', (d) => (d.children ? stroke : fill))
    .attr('r', (d) => (d.data.hidden ? 0 : radius));

  if (title != null) node.append('title').text((d) => title(d.data, d));

  if (L)
    node
      .append('text')
      .attr('dy', '0.32em')
      .attr('y', () => 10)
      .attr('text-anchor', () => 'middle')
      .attr('paint-order', 'stroke')
      .attr('stroke', halo)
      .attr('stroke-width', haloWidth)
      .text((d) => {
        return label?.(d.data, d) ?? null;
      });

  return svg.node();
}

function createTree() {
  const genealogy = {
    name: 'Eve',
    children: [
      { name: 'Cain' },
      { name: 'Seth', children: [{ name: 'Enos' }, { name: 'Noam' }] },
      { name: 'Abel' },
      { name: 'Awan', children: [{ name: 'Enoch' }] },
      { name: 'Azura' },
    ],
  };

  const yetAnotherGenealogy = {
    name: 'God',
    hidden: true,
    children: [
      {
        name: 'Adam',
      },
      {
        name: 'Eve',
        children: [
          {
            name: 'Kain',
          },
        ],
      },
    ],
  };

  const plainGenealogy = [
    {
      name: 'Mother',
      id: 0,
      parentId: null,
    },
    {
      name: 'Father',
      id: 1,
      parentId: null,
    },
    {
      name: 'Child',
      id: 0,
      parentId: null,
    },
  ];

  // const flare = flareJson;
  const chart = Tree(
    getRomanovTreeStructure({
      childrenAlign: 'parent',
      groupMarriagesBy: 'firstPersonId',
    }),
    {
      mode: 'vertical',
      label: (d) => d.name,
      title: (_, n) =>
        `${n
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join('.')}`, // hover text
      link: (_, n) =>
        `https://github.com/prefuse/Flare/${n.children ? 'tree' : 'blob'}/master/flare/src/${n
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join('/')}${n.children ? '' : '.as'}`,
      // width: 300,
      // height: 300,
      dx: 100,
      dy: 100,
    },
  );

  return chart;
}

onMounted(() => {
  const treeContainer = treeRoot.value;
  if (!treeContainer) {
    return;
  }
  const tree = createTree();
  if (!tree) {
    return;
  }

  treeContainer.append(tree);
});
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
