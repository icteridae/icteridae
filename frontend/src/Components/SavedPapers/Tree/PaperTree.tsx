import * as React from "react";
import { Tree, Icon } from "rsuite";
import { getSavedPapers, setSavedPapers } from "../../../Utils/Webstorage";
import Config from "../../../Utils/Config";
import { useEffect } from "react";

type TreeType = {
    label?: any;
    value: string;
    children?: TreeInterface[];
    id?: string;
    name?: string;
};
interface TreeInterface extends TreeType { }

const data: TreeInterface[] = [
    {
        name: "Folder 1",
        value: "d1",
        children: [],
    },
    {
        id: "ebe84b47c84537f3d536aed004955799c2f212a0",
        value: "p2",
    },
    {
        name: "Folder 3",
        value: "d3",
        children: [
            {
                id: "5b5df4500756561e3d15a8a10958d6575ab3bc28",
                value: "p4",
            },
            {
                id: "0c70c3a504a3c8b46cc02d1c290d93bfe84f7651",
                value: "p5",
            },
        ],
    },
];

const fixTree = (tree: any): Array<TreeInterface> => {
    const isFolder = tree.value.charAt(0) === "d";
    if (!tree.children) return [tree];
    if (isFolder)
        return [
            {
                name: tree.name,
                label: tree.label,
                value: tree.value,
                children: [].concat(...tree.children.map(fixTree)),
            },
        ];
    return [
        {
            label: tree.label,
            value: tree.value,
            id: tree.id,
        },
    ].concat(...tree.children.map(fixTree));
};

const createPaperTreeData = (tree: Array<TreeInterface>, promises: Array<Promise<string | void>>, FolderIds: Array<Number>, name: string, id: string ): Array<TreeInterface> => {
    for (let item in tree) {
        if (tree[item].value.charAt(0) === "p") {
            const baseURL: string = Config.base_url;
            promises.push(
                fetch(baseURL + "/api/paper/?paper_id=" + tree[item].id)
                    .then((res) => res.json())
                    .then((res) => {
                        tree[item].label = res.title;
                    })
            );
        } else if (tree[item].value.charAt(0) === "d") {
            FolderIds.push(parseInt(tree[item].value.substring(1)));
            if (tree[item].value === id) {
                tree[item].label = (
                    <div>
                        <Icon icon="folder"></Icon> {name}
                    </div>
                );
                tree[item].name = name;
            } else {
                tree[item].label = (
                    <div>
                        <Icon icon="folder"></Icon> {tree[item].name}
                    </div>
                );
            }
            tree[item].children = createPaperTreeData(tree[item].children!, promises, FolderIds, name, id );
        }
    }
    return tree;
};

const DeletePaperTreeData = (data: Array<TreeInterface>, shouldDelete: boolean, toDelete : string) => {
    let temp: Array<TreeInterface> = [];
    for (let item in data) {
        if(shouldDelete && data[item].value === toDelete) {
            continue;
        }
        if (data[item].value.charAt(0) === "p") {
            temp.push({ id: data[item].id, value: data[item].value });
        } else if (data[item].value.charAt(0) === "d") {
            let children: Array<TreeInterface> = [];
            if (!(typeof data[item].children == "undefined"))
                children = DeletePaperTreeData(data[item].children!, shouldDelete, toDelete);
            temp.push({
                value: data[item].value,
                name: data[item].name,
                children: children,
            });
        }
    }
    return temp;
};



const PaperTree: React.FC<{choosePaper: Function; height: number; name: string; id: string; toDelete: string;}> = (props) => {
    let [treeData, setTreeData] = React.useState(getSavedPapers);
    let [folderIds, setFolderIds] = React.useState([] as Array<Number>);

    useEffect(() => {
        helperFunction(false);
    }, [props.name]);

    useEffect(() => {
        helperFunction(true);
    }, [props.toDelete]);

    const helperFunction = (shouldDelete: boolean) => {
        let data = JSON.parse(JSON.stringify(treeData)) as Array<TreeInterface>;
        let ids: Array<Number> = [];
        let promises: Array<Promise<string | void>> = [];
        data = DeletePaperTreeData(data, shouldDelete, props.toDelete);

        createPaperTreeData(data, promises, ids, props.name, props.id);
        Promise.all(promises).then(() => {
            setTreeData(data);
            MakeTreeSaveFriendly(data);
        });
        setFolderIds(ids);
    }

    const MakeTreeSaveFriendly = (c: Array<TreeInterface>) => {
        let tree: Array<TreeInterface>;
        tree = DeletePaperTreeData(c, false, "");
        setSavedPapers(tree);
    };


    const AddFolder = (name: string) => {
        let tree = JSON.parse(JSON.stringify(treeData)) as Array<TreeInterface>;
        let id = Math.floor(Math.random() * 10000);
        while (folderIds.includes(id)) id = Math.floor(Math.random() * 10000);
        tree.push({ value: "d" + id.toString(), name: name, children: [] });

        tree = DeletePaperTreeData(tree, false, "");

        let promises: Array<Promise<string | void>> = [];
        let data = JSON.parse(JSON.stringify(tree)) as Array<TreeInterface>;
        let ids: Array<Number> = [];
        createPaperTreeData(data, promises, ids, "", "");
        Promise.all(promises).then(() => {
            setTreeData(data);
            MakeTreeSaveFriendly(data);
        });
        setFolderIds(ids);
    };

    return (
        <div>
            <Tree
                data={treeData}
                draggable
                defaultExpandAll
                virtualized={false}
                onDrop={(
                    { dropNode, dropNodePosition, createUpdateDataFunction }: any,
                    event: any
                ) => {
                    const v = createUpdateDataFunction(treeData);
                    const c = fixTree({ value: "d", children: v })[0].children;
                    setTreeData(c!);
                    MakeTreeSaveFriendly(c!);
                }}
                onSelect={(active, value, event) => props.choosePaper(active)}
                height={props.height}
            />
            <button
                onClick={() => {
                    console.log(treeData);
                    AddFolder("Hallo!");
                }}
            >
                Ich bin ein Button!{" "}
            </button>
        </div>
    );
};

export default PaperTree;