import type { TTree } from './tree';

type TPerson = {
  id: number;
  name: string;
  parentsRelationId: number | null;
};

type TRelationType = 'marriage';

type TRelation = {
  id: number;
  firstPersonId: number;
  secondPersonId: number;
  type: TRelationType;
};

function createIdGenerator(start: number) {
  let counter = start;

  return () => counter++;
}

class Genealogy {
  persons: TPerson[] = [];
  relations: TRelation[] = [];

  private getPersonId = createIdGenerator(0);
  private getRelationId = createIdGenerator(0);

  addPerson(config: Partial<TPerson> = {}) {
    const person: TPerson = {
      id: this.getPersonId(),
      name: '',
      parentsRelationId: null,
      ...config,
    };
    this.persons.push(person);
    return person;
  }

  addRelation(firstPerson: TPerson, secondPerson: TPerson) {
    const relation: TRelation = {
      id: this.getRelationId(),
      firstPersonId: firstPerson.id,
      secondPersonId: secondPerson.id,
      type: 'marriage',
    };
    this.relations.push(relation);
    return relation;
  }

  getPerson(personId: number) {
    const person = this.persons.find((person) => person.id === personId);
    if (!person) {
      throw new Error(`Person with id:${personId} not found`);
    }
    return person;
  }

  getPersonsByParentRelationId(parentRelationId: number) {
    return this.persons.filter((person) => person.parentsRelationId === parentRelationId);
  }

  getRelation(relationId: number) {
    const relation = this.relations.find((relation) => relation.id === relationId);
    if (!relation) {
      throw new Error(`Relation with id:${relationId} not found`);
    }
    return relation;
  }

  getRelationsByPersonId(personId: number) {
    return this.relations.filter(
      (relation) => relation.firstPersonId === personId || relation.secondPersonId === personId,
    );
  }
}

const romanovGenealogy = new Genealogy();

let relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Михаил Федорович' }),
  romanovGenealogy.addPerson({ name: 'Евдокия Стрешнева' }),
);

let firstPerson = romanovGenealogy.addPerson({
  name: 'Алексей Михайлович',
  parentsRelationId: relation.id,
});

relation = romanovGenealogy.addRelation(firstPerson, romanovGenealogy.addPerson({ name: 'Мария Милославская' }));
romanovGenealogy.addPerson({ name: 'Федор Алексеевич', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Софья Алексеевна', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Иван V', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Прасковья Салтыкова' }),
);

romanovGenealogy.addPerson({ name: 'Анна Иоановна', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Екатерина', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Карл Леопольд' }),
);

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Анна Леопольдовна', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Антон Ульрих' }),
);

romanovGenealogy.addPerson({ name: 'Иван VI', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Алексей', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Екатерина', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Елизавета', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Петр', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Наталья Нарышкина' }),
);

firstPerson = romanovGenealogy.addPerson({ name: 'Петр I', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Евдокия Лопухина' }),
);

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Алексей', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Софья Шарлотта' }),
);

const startPerson = romanovGenealogy.addPerson({ name: 'Петр II', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Екатерина I' }),
);

romanovGenealogy.addPerson({ name: 'Елизавета I', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Петр', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Анна', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Карл Фридрих' }),
);

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Петр III', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Екатерина II' }),
);

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Павел I', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Мария Федоровна' }),
);

romanovGenealogy.addPerson({ name: 'Екатерина', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Константин', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Александра', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Ольга', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Анна', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Елена', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Михаил', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Мария', parentsRelationId: relation.id });

firstPerson = romanovGenealogy.addPerson({ name: 'Николай I', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Александр I', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Елизавета Алексеевна' }),
);

romanovGenealogy.addPerson({ name: 'Елизавета', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Мария', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Александра Федоровна' }),
);

romanovGenealogy.addPerson({ name: 'Михаил', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Николай', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Константин', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Ольга', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Александра', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Мария', parentsRelationId: relation.id });

firstPerson = romanovGenealogy.addPerson({ name: 'Александр II', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Екатерина Долгорукова' }),
);

romanovGenealogy.addPerson({ name: 'Георгий', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Ольга', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Екатерина', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Борис', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  firstPerson,
  romanovGenealogy.addPerson({ name: 'Мария Александровна' }),
);

romanovGenealogy.addPerson({ name: 'Алексей', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Сергей', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Павел', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Мария', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Александра', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Николай', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Владимир', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Александр III', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Мария Федоровна' }),
);

romanovGenealogy.addPerson({ name: 'Александр', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Георгий', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Ксения', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Михаил', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Ольга', parentsRelationId: relation.id });

relation = romanovGenealogy.addRelation(
  romanovGenealogy.addPerson({ name: 'Николай II', parentsRelationId: relation.id }),
  romanovGenealogy.addPerson({ name: 'Александра Федоровна' }),
);

romanovGenealogy.addPerson({ name: 'Ольга', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Татьяна', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Мария', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Анастасия', parentsRelationId: relation.id });
romanovGenealogy.addPerson({ name: 'Алексей', parentsRelationId: relation.id });

type TGenealogicalTreeNodeType = 'node' | 'marriage';
type TGenealogicalTreeData = {
  nodeType: TGenealogicalTreeNodeType;
};
function createTreeNodeFromPerson(person: TPerson): TTree<TGenealogicalTreeData> {
  return {
    name: person.name,
    id: `person-${person.id}`,
    children: [],
    data: {
      nodeType: 'node',
    },
  };
}

function createTreeMarriageNodeFromRelation(relation: TRelation): TTree<TGenealogicalTreeData> {
  return {
    name: '',
    id: `marriage-${relation.id}`,
    children: [],
    data: {
      nodeType: 'marriage',
    },
  };
}

function createTreeStructure(genealogy: Genealogy, startPersonId: number) {
  const startPerson = genealogy.getPerson(startPersonId);

  const roots: TTree<TGenealogicalTreeData>[] = [];
  const startPersonNode = createTreeNodeFromPerson(startPerson);

  function createTree(
    currentPerson: TPerson,
    parentNode: TTree<TGenealogicalTreeData> | null,
    childNode: TTree<TGenealogicalTreeData> | null,
    // currentNode: TTree<TGenealogicalTreeData>,
    prevPersonId: number,
  ) {
    const currentNode = createTreeNodeFromPerson(currentPerson);
    const parents: TPerson[] = [];
    if (typeof currentPerson.parentsRelationId === 'number') {
      const relation = genealogy.getRelation(currentPerson.parentsRelationId);
      parents.push(genealogy.getPerson(relation.firstPersonId));
      parents.push(genealogy.getPerson(relation.secondPersonId));
    } else {
      roots.push(currentNode);
    }

    parents.forEach((parent) => {
      if (parent.id === prevPersonId) {
        return;
      }
      // const parentNode = createTreeNodeFromPerson(parent);
      createTree(parent, null, currentNode, currentPerson.id);
    });

    const marriages = genealogy.getRelationsByPersonId(currentPerson.id);

    marriages.forEach((marriage) => {
      const marriageNode = createTreeMarriageNodeFromRelation(marriage);
      parentNode?.children?.push(marriageNode);
      const childs = genealogy.getPersonsByParentRelationId(marriage.id);
      childs.forEach((child) => {
        const childNode = createTreeNodeFromPerson(child);
        marriageNode.children?.push(childNode);
        if (child.id === prevPersonId) {
          return;
        }
        createTree(child, marriageNode, null, currentPerson.id);
      });
    });
  }

  createTree(startPerson, startPersonNode, startPerson.id);
}

// export const romanovTreeStructure = createTreeStructure(romanovGenealogy, startPerson.id);

function createFullTreeStructure(genealogy: Genealogy, startPersonId: number) {
  // TODO возможно нам нужны не все люди по поколениям, а только те у которых нет родителей в каждом из поколений
  const generationsMap = new Map<number, Map<number, TPerson>>();
  let minGenerationIndex = 0;
  let maxGenerationIndex = 0;

  function addPersonToGeneration({
    person,
    generationNumber,
  }: {
    person: TPerson;
    generationNumber: number;
  }) {
    let generation = generationsMap.get(generationNumber);
    if (!generation) {
      generation = new Map();
    }

    generation.set(person.id, person);

    generationsMap.set(generationNumber, generation);
  }

  function recalcGenerationsIndexes(generationNumber: number) {
    if (minGenerationIndex > generationNumber) {
      minGenerationIndex = generationNumber;
    } else if (generationNumber > maxGenerationIndex) {
      maxGenerationIndex = generationNumber;
    }
  }

  const marriagesMap = new Map<number, TRelation[]>();

  function addMarriageToPerson(marriage: TRelation, personId: number) {
    let marriages = marriagesMap.get(personId);
    if (!marriages) {
      marriages = [marriage];
    } else {
      marriages.push(marriage);
    }

    marriagesMap.set(personId, marriages);
  }

  function addMarriage(marriage: TRelation) {
    const { firstPersonId, secondPersonId } = marriage;

    addMarriageToPerson(marriage, firstPersonId);
    addMarriageToPerson(marriage, secondPersonId);
  }

  const childsMap = new Map<number, TPerson[]>();

  function addChild(person: TPerson) {
    const { parentsRelationId } = person;

    if (parentsRelationId === null) {
      return;
    }

    let childs = childsMap.get(parentsRelationId);

    if (!childs) {
      childs = [person];
    } else {
      childs.push(person);
    }

    childsMap.set(parentsRelationId, childs);
  }

  function iterateOverGenealogy(
    {
      currentPersonId,
      previousPersonId,
      previousRelationId,
      previousParentRelationId,
      generationNumber,
    }:
    {
      currentPersonId: number;
      previousPersonId: number | null;
      previousRelationId: number | null;
      previousParentRelationId: number | null;
      generationNumber: number;
    },

  ) {
    recalcGenerationsIndexes(generationNumber);
    const person = genealogy.getPerson(currentPersonId);
    addPersonToGeneration({
      person,
      generationNumber,
    });

    addChild(person);

    if (person.parentsRelationId !== null && person.parentsRelationId !== previousParentRelationId) {
      const parentRelation = genealogy.getRelation(person.parentsRelationId);
      const parents = [
        genealogy.getPerson(parentRelation.firstPersonId),
        genealogy.getPerson(parentRelation.secondPersonId),
      ];

      addMarriage(parentRelation);

      parents.forEach((parent) => {
        iterateOverGenealogy({
          currentPersonId: parent.id,
          previousPersonId: currentPersonId,
          previousRelationId: parentRelation.id,
          previousParentRelationId: null,
          generationNumber: generationNumber - 1,
        });
      });
      const siblings = genealogy.getPersonsByParentRelationId(parentRelation.id).filter(
        (sibling) => sibling.id !== currentPersonId,
      );
      siblings.forEach((sibling) => {
        iterateOverGenealogy({
          currentPersonId: sibling.id,
          previousPersonId: currentPersonId,
          previousRelationId: null,
          previousParentRelationId: parentRelation.id,
          generationNumber,
        });
      });
    }

    const marriages = genealogy.getRelationsByPersonId(currentPersonId);
    /**
     * Теоретически с одним и тем же человеком может быть несколько браков
     * тогда relationId будут разными, а набор людей в браке одинаков.
     * Дети от этих разных браков также будут иметь разный parentRelationId.
     * Возможно имеет смысл такие ситуации как-то объединять на постобработке.
     * На данный момент в этом случае будут дубликаты супругов.
     */
    const filteredMarriages = previousRelationId !== null
      ? marriages.filter((marriage) => marriage.id !== previousRelationId)
      : marriages;

    filteredMarriages.forEach((marriage) => {
      const anotherPersonId = marriage.firstPersonId === currentPersonId
        ? marriage.secondPersonId
        : marriage.firstPersonId;

      addMarriage(marriage);

      iterateOverGenealogy({
        currentPersonId: anotherPersonId,
        previousPersonId: currentPersonId,
        previousRelationId: marriage.id,
        previousParentRelationId: null,
        generationNumber,
      });

      const children = genealogy.getPersonsByParentRelationId(marriage.id);

      children.forEach((child) => iterateOverGenealogy({
        currentPersonId: child.id,
        previousPersonId: currentPersonId,
        previousRelationId: null,
        previousParentRelationId: marriage.id,
        generationNumber: generationNumber + 1,
      }));
    });
  }

  iterateOverGenealogy({
    currentPersonId: startPersonId,
    previousPersonId: null,
    previousRelationId: null,
    previousParentRelationId: null,
    generationNumber: 0,
  });

  const generations = Array.from(generationsMap.entries()).sort(([a], [b]) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  });

  // const marriagesGenerations = Array.from(marriagesGenerationsMap.entries()).sort(([a], [b]) => {
  //   if (a > b) {
  //     return 1;
  //   } else if (a < b) {
  //     return -1;
  //   }
  //   return 0;
  // });

  const treeRoot: TTree<any> = {
    name: '',
    hidden: true,
    type: 'person',
  };

  function iterateOverMarriages({
    personId,
    touchedPersons,
    resultMarriages,
    resultPersons,
  }: {
    personId: number;
    touchedPersons: Set<number>;
    resultMarriages: TRelation[];
    resultPersons: TPerson[];
  }) {
    if (touchedPersons.has(personId)) {
      return;
    }

    const personMarriages = marriagesMap.get(personId);
    if (!personMarriages || !personMarriages.length) {
      return;
    }

    touchedPersons.add(personId);
    const person = genealogy.getPerson(personId);
    resultPersons.push(person);

    personMarriages.forEach((marriage) => {
      const { firstPersonId, secondPersonId } = marriage;
      const anotherPersonId = firstPersonId === personId ? secondPersonId : firstPersonId;
      if (touchedPersons.has(anotherPersonId)) {
        return;
      }
      resultMarriages.push(marriage);
      iterateOverMarriages({
        personId: anotherPersonId,
        touchedPersons,
        resultMarriages,
        resultPersons,
      });
    });
  }

  function mapPersonToTreeNode(person: TPerson): TTree<any> {
    return {
      name: person.name,
      type: 'person',
    };
  }

  function getNodesCenterNode(nodes: TTree<any>[]) {
    const centerIndex = Math.floor(nodes.length / 2);
    let centerNode: TTree<any>;
    if (nodes.length % 2 === 0) {
      centerNode = {
        name: '',
        type: 'person',
        noParent: true,
      };
      nodes.splice(centerIndex, 0, centerNode);
    } else {
      centerNode = nodes[centerIndex];
    }

    return centerNode;
  }

  function mapMarriageToTreeNode(marriage: TRelation): TTree<any> {
    return {
      noParent: true,
      name: '',
      type: 'marriage',
    };
  }

  const personsInGenerationWithoutParents = Array.from(generations[1][1].values()).filter(
    (person) => person.parentsRelationId === null,
  );

  function getNewPersonsAndNewMarriagesFromChilds({
    childs,
    touchedPersons,
  }: {
    childs: TPerson[];
    touchedPersons: Set<number>;
  }) {
    const newMarriages: TRelation[] = [];
    const newPersons: TPerson[] = [];
    childs.forEach((child) => {
      if (touchedPersons.has(child.id)) {
        return;
      }
      const childPersonsWithMarriagesPerson: TPerson[] = [];
      iterateOverMarriages({
        personId: child.id,
        resultMarriages: newMarriages,
        touchedPersons,
        resultPersons: childPersonsWithMarriagesPerson,
      });

      if (childPersonsWithMarriagesPerson.length) {
        newPersons.push(...childPersonsWithMarriagesPerson);
      } else {
        newPersons.push(child);
      }
    });

    return { newMarriages, newPersons };
  }

  function stepOverMarriage({
    marriageNode,
    childs,
    touchedPersons,
  }: {
    marriageNode: TTree<any>;
    childs: TPerson[];
    touchedPersons: Set<number>;
  }) {
    const { newPersons, newMarriages } = getNewPersonsAndNewMarriagesFromChilds({ childs, touchedPersons });
    const newPersonsNodes = newPersons.map(mapPersonToTreeNode);
    marriageNode.children = newPersonsNodes;

    const personsMiddleNode = getNodesCenterNode(marriageNode.children);

    const newMarriagesNodes = newMarriages.map(mapMarriageToTreeNode);
    personsMiddleNode.children = newMarriagesNodes;

    return { newMarriagesNodes, newMarriages };
  }

  function createTreeWithAllNodes() {
    // TODO подумать как управлять touchedPersons
    const touchedPersons = new Set<number>();
    const startPersons = Array.from(generations[0][1].values());
    const { newMarriages: firstMarriages, newMarriagesNodes: firstMarriagesNodes } = stepOverMarriage({
      marriageNode: treeRoot,
      childs: startPersons,
      touchedPersons,
    });

    let currentMarriages = firstMarriages;
    let currentMarriagesNodes = firstMarriagesNodes;

    let nextMarriages: TRelation[] = [];
    let nextMarriagesNodes: TTree<any>[] = [];
    for (let i = 1; i < generations.length; i++) {
      touchedPersons.clear();
      currentMarriagesNodes.forEach((marriageNode, index) => {
        const marriage = currentMarriages[index];
        const childs = childsMap.get(marriage.id);
        if (!childs) {
          return;
        }
        const { newMarriages, newMarriagesNodes } = stepOverMarriage({
          marriageNode,
          childs,
          touchedPersons,
        });
        nextMarriages.push(...newMarriages);
        nextMarriagesNodes.push(...newMarriagesNodes);
      });
      currentMarriages = nextMarriages;
      currentMarriagesNodes = nextMarriagesNodes;

      nextMarriages = [];
      nextMarriagesNodes = [];
    }
  }

  createTreeWithAllNodes();

  // generations.reduce((acc, [, generation], generationIndex) => {
  //   const children = Array.from(generation.values()).map((person): TTree<any> => {
  //     return {
  //       // id: person.id.toString(),
  //       noParent: true,
  //       name: person.name,
  //       type: 'person',
  //     };
  //   });

  //   if (!children.length) {
  //     return acc;
  //   }

  //   const middleIndex = Math.floor(children.length / 2);
  //   let middleNode: TTree<any>;
  //   if (children.length % 2 === 0) {
  //     middleNode = {
  //       name: '',
  //       type: 'person',
  //       noParent: true,
  //     };
  //     children.splice(middleIndex, 0, middleNode);
  //   } else {
  //     middleNode = children[middleIndex];
  //   }

  //   acc.children = children;

  //   return middleNode;
  // }, treeRoot);

  return treeRoot;
}

export const romanovTreeStructure = createFullTreeStructure(romanovGenealogy, startPerson.id);
