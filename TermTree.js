


// Create a tree data structure class to represent the window pane layout
// The tree should have a root pane and each pane should have a list of children panes
// Each pane should have a string property that represents the pane name
// The tree should have a method that returns a string representation of the tree
class Pane {
    constructor(name) {
        this.name = name;
        this.children = [];
        this.parent = null;
        this.content = "";
        this.width = 0;
        this.height = 0;
    }
}

export class TermTree {
    constructor() {
        this.root = new Pane("0-pane");
        this.paneCounter = 0;
        this.splitCounter = 0;
        this.selected = null; 
        this.add_pane_listeners()

        // Add functions
    }

    // Add a new node to the tree
    add_node(name, parentName) {
        let parent = this.find_node(parentName);
        if (parent) {
            let newPane = new Pane(name);
            newPane.parent = parent;

            parent.children.push(newPane);



            return newPane.name;
        } else {
            console.log("Parent not found");
        }
    }

    // Add a new pane to the tree
    add_new_pane(parentName) {
        this.paneCounter++;
        return this.add_node(this.paneCounter + "-pane", parentName);
    }

    // add new split pane
    add_split_pane(parentName, orientation) {
        this.splitCounter++;
        return this.add_node(this.splitCounter + "-split-" + orientation, parentName, orientation);
    }

    //remove a pane from a parent
    remove_node(name, parentName) {
        let parent = this.find_node(parentName);
        if (parent) {
            let index = parent.children.findIndex(child => child.name === name);
            if (index !== -1) {
                parent.children.splice(index, 1);
            } else {
                console.log("Child not found");
            }
        } else {
            console.log("Parent not found");
        }
    }

    // Will return a pane based on its name
    find_node(name, pane = this.root) {
        if (pane.name === name) {
            return pane;
        } else {
            for (let child of pane.children) {
                let found = this.find_node(name, child);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    // Print the tree
    print_tree(pane = this.root, level = 0) {
        let result = "";
        for (let i = 0; i < level; i++) {
            result += "  ";
        }
        result += pane.name + "\n";
        for (let child of pane.children) {
            result += this.print_tree(child, level + 1);
        }
        return result;
    }

    // Convert the tree to a list of panes
    tree_to_list(pane = this.root) {
        let list = [];
        list.push(pane.name);
        for (let child of pane.children) {
            list = list.concat(this.tree_to_list(child));
        }
        return list;
    }

    // Convert the tree to an object
    tree_to_obj(pane = this.root) {
        let obj = {};
        obj[pane.name] = [];
        for (let child of pane.children) {
            obj[pane.name].push(this.tree_to_obj(child));
        }
        return obj;
    }

    // Export the tree as a JSON string
    export_tree() {
        return JSON.stringify(this.tree_to_obj());
    }

    // Move pane
    move_pane(name, parentName) {
        let pane = this.find_node(name);
        let new_parent = this.find_node(parentName);
        let old_parent = pane.parent;

        if (pane === this.root && new_parent) {
            // Make the new parent remember the pane
            console.log("Can not move root pane")
            return
        }


        if (pane && new_parent && old_parent) {

            // Make the new parent remember the pane
            new_parent.children.push(pane);


            // Make old parent forget about the pane
            let index = old_parent.children.findIndex(child => child.name === pane.name);
            if (index !== -1) {
                old_parent.children.splice(index, 1);
            }

            // Make the pane remember the new parent
            pane.parent = new_parent;




        } else {
            console.log("move_pane: Pane or parent not found");
        }


    }

    // Split a pane into two panes
    split_pane(name, orientation) {

        // If the orientation is vertical then will make the
        // parent pane a vertical split, and add the original pane
        // along with a new pane to the parent pane

        let pane_being_split = this.find_node(name);

        if (pane_being_split === this.root) {
            // add a split pane to root
            let split_pane_name = this.add_split_pane(this.root.name, orientation);
            let split_pane = this.find_node(split_pane_name);

            // make split pane the new root
            this.root = split_pane;

            // fix pane being split
            pane_being_split.parent = this.root;

            // remove the root from pane being split children]
            let index = pane_being_split.children.findIndex(child => child.name === split_pane_name);
            if (index !== -1) {
                pane_being_split.children.splice(index, 1);
            }

            // make old roots parent the new root
            split_pane.parent = this.root.parent;

            // make old old root a child of the new root
            this.root.children.push(pane_being_split);

            // add new pane to split pane
            this.add_new_pane(split_pane.name, "back");


        } else {
            // Get parent of the pane being split
            let parent = pane_being_split.parent;

            // Get the index of the pane being split in the parent children
            let original_index = parent.children.findIndex(child => child.name === pane_being_split.name);

            // add a split pane to the parent
            let split_pane = this.add_split_pane(parent.name, orientation);
            // Git split pane index in parent children
            let split_pane_index = parent.children.findIndex(child => child.name === split_pane);

            // Switch split_pane and pane_being_split positions in the parent children
            parent.children[original_index] = this.find_node(split_pane);
            parent.children[split_pane_index] = pane_being_split;


            // Add the original pane to the split pane
            this.move_pane(pane_being_split.name, split_pane);

            // Add a new pane to the split pane
            this.add_new_pane(split_pane);
        }
    }

    // turn tree into lists of nodes in levels
    // will have lists in the form [[nodes at level 0],[nodes at level 1],[nodes at level 2]]
    tree_to_levels() {
        let levels = [[this.root]];
        let current_level = 0;

        while (levels[current_level].length > 0) {
            let next_level = [];
            for (let node of levels[current_level]) {
                next_level = next_level.concat(node.children);
            }
            levels.push(next_level);
            current_level++;
        }

        return levels;
    }

    add_pane_listeners() {
        console.log("Adding pane listeners")
        const panes_class = "pane"
        const panes = document.querySelectorAll(`.${panes_class}`)
        panes.forEach(pane => this.pane_listeners(pane));
    }

    // pane name to div element
    name_to_pane(name) {
        return document.querySelector(`[data-name="${name}"]`);
    }
    
    selected_pane(pane) {
        let new_selected = this.name_to_pane(pane);
        let old_selected = this.name_to_pane(this.selected);

        if (old_selected !== null && old_selected !== new_selected) {
            (old_selected).classList.remove('selected');
        }
        this.selected = pane;
        new_selected.classList.add('selected');
    }
    
    pane_listeners(pane) {
    
        pane.addEventListener('click', () => {
            this.selected_pane(pane.dataset.name);
        });
    }


    // Turn tree to pane layout
    update_window() {
        // get <div class="termWindow">
        let termWindow = document.querySelector(".termWindow");
        // clear it termWindow children
        termWindow.innerHTML = "";

        // get the tree as a object
        let tree_obj = this.tree_to_levels();

        // remove empty levels
        tree_obj = tree_obj.filter(level => level.length > 0)

        // go through each of the levels
        for (let level of tree_obj) {

            for (let node of level) {
                // get node info from names
                let node_info = node.name.split("-");
                let order = node_info[0];
                let type = node_info[1];

                // Create div
                let new_node = document.createElement("div");
                new_node.className = type;
                if (node_info.length > 2) {
                    new_node.className = type + "-" + node_info[2];
                } else {
                    new_node.className = type;
                }


                new_node.dataset.order = order;
                new_node.dataset.name = node.name;

                // check if the node is a split
                if (type === "split") {
                    // add split type id
                }

                // check if the node is a pane
                else if (type === "pane") {
                    // Add div content
                    new_node.textContent = order;

                }

                // add pane to parent
                // selected based on data-name
                let parent = termWindow.querySelector(`[data-name="${node.parent.name}"]`);
                if (parent === null) {
                    parent = termWindow;
                }
                parent.appendChild(new_node);
            }

        }
        // update panes to have listeners
        this.add_pane_listeners()
        // keep selected pane selected
        this.selected_pane(this.selected);
    }
}