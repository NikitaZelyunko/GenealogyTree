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
  const generationsMap = new Map<number, TPerson[]>();
  let minGenerationIndex = 0;
  let maxGenerationIndex = 0;

  function addPersonToGeneration(person: TPerson, generationNumber: number) {
    const generation = generationsMap.get(generationNumber);
    if (!generation) {
      generationsMap.set(generationNumber, [person]);
    } else {
      generation.push(person);
      generationsMap.set(generationNumber, generation);
    }
  }

  function recalcGenerationsIndexes(generationNumber: number) {
    if (minGenerationIndex > generationNumber) {
      minGenerationIndex = generationNumber;
    } else if (generationNumber > maxGenerationIndex) {
      maxGenerationIndex = generationNumber;
    }
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
    addPersonToGeneration(person, generationNumber);

    if (person.parentsRelationId !== null && person.parentsRelationId !== previousParentRelationId) {
      const parentRelation = genealogy.getRelation(person.parentsRelationId);
      const parents = [
        genealogy.getPerson(parentRelation.firstPersonId),
        genealogy.getPerson(parentRelation.secondPersonId),
      ];
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
  debugger;

  const treeRoot: TTree<any> = {
    name: '',
    hidden: true,
    type: 'person',
  };

  generations.reduce((acc, [, generation]) => {
    const children = generation.map((person): TTree<any> => {
      return {
        // id: person.id.toString(),
        name: person.name,
        type: 'person',
      };
    });

    if (!children.length) {
      return acc;
    }

    const middleIndex = Math.floor(children.length / 2);
    let middleNode: TTree<any>;
    if (children.length % 2 === 0) {
      middleNode = {
        name: '',
        type: 'person',
      };
      children.splice(middleIndex, 0, middleNode);
    } else {
      middleNode = children[middleIndex];
    }

    acc.children = children;

    return middleNode;
  }, treeRoot);

  return treeRoot;
}

export const romanovTreeStructure = createFullTreeStructure(romanovGenealogy, startPerson.id);
