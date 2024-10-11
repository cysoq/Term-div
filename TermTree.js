


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
            console.log("add_node: Parent not found");
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
            console.log("remove_node: Parent not found");
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

    // detrmine if a panes border is touching the border of another pane


    // get neighbors of a pane, based on the direction they are to it
    get_neighbors(name) {

        let neighbors = {
            "left": [],
            "right": [],
            "up": [],
            "down": []
        }

        if (this.selected === this.root.name) {
            return neighbors
        }


        // get panes position of border
        // get pane div
        let selected_div = this.name_to_pane(name);
        // get edge dimensions
        let selected_edges = selected_div.getBoundingClientRect();

        // get all the panes in the tree
        let panes = this.get_panes();

        // go through each pane
        for (let neighbor of panes) {
            // get neighbor div
            let neighbor_div = this.name_to_pane(neighbor);
            // get edge dimensions
            let neighbor_edges = neighbor_div.getBoundingClientRect();

            // get css variable for grid gap from :root 
            let root = document.documentElement;
            let grid_gap = getComputedStyle(root).getPropertyValue('--border_width');
            // convert to number
            grid_gap = parseInt(grid_gap);
            // That will be the tolerance for the border to be considered touching
            let tolerance = grid_gap + .01;

            // check if the neighbor is to the left
            if (Math.abs(selected_edges.left - neighbor_edges.right) < tolerance) {
                // make sure the neighbor side is touching the selected side
                if (selected_edges.top < neighbor_edges.bottom && selected_edges.bottom > neighbor_edges.top) {
                    neighbors.left.push(neighbor);
                }
            }
            // check if the neighbor is to the right
            if (Math.abs(selected_edges.right - neighbor_edges.left) < tolerance) {
                // make sure the neighbor side is touching the selected side
                if (selected_edges.top < neighbor_edges.bottom && selected_edges.bottom > neighbor_edges.top) {
                    neighbors.right.push(neighbor);
                }
            }

            // check if the neighbor is above
            if (Math.abs(selected_edges.top - neighbor_edges.bottom) < tolerance) {
                // make sure the neighbor side is touching the selected side
                if (selected_edges.left < neighbor_edges.right && selected_edges.right > neighbor_edges.left) {
                    neighbors.up.push(neighbor);
                }
            }

            // check if the neighbor is below
            if (Math.abs(selected_edges.bottom - neighbor_edges.top) < tolerance) {
                // make sure the neighbor side is touching the selected side
                if (selected_edges.left < neighbor_edges.right && selected_edges.right > neighbor_edges.left) {
                    neighbors.down.push(neighbor);
                }
            }
        }

        // order each neighbor direction to be in order of most left, right, up, down

        // sort left neighbors based on the most top
        // make it sorted based on the neighbors top edge
        neighbors.left = neighbors.left.sort((a, b) => {
            let a_div = this.name_to_pane(a);
            let b_div = this.name_to_pane(b);
            if (a_div && b_div) {
                return a_div.getBoundingClientRect().top - b_div.getBoundingClientRect().top;
            }
            return 0;
        });

        // sort right neighbors based on the most top
        // make it sorted based on the neighbors top edge
        neighbors.right = neighbors.right.sort((a, b) => {
            let a_div = this.name_to_pane(a);
            let b_div = this.name_to_pane(b);
            if (a_div && b_div) {
                return a_div.getBoundingClientRect().top - b_div.getBoundingClientRect().top;
            }
            return 0;
        });

        // make top neighbors sorted based on the neighbors left edge
        neighbors.up = neighbors.up.sort((a, b) => {
            let a_div = this.name_to_pane(a);
            let b_div = this.name_to_pane(b);
            if (a_div && b_div) {
                return a_div.getBoundingClientRect().left - b_div.getBoundingClientRect().left;
            }
            return 0;
        });

        // make bottom neighbors sorted based on the neighbors left edge
        neighbors.down = neighbors.down.sort((a, b) => {
            let a_div = this.name_to_pane(a);
            let b_div = this.name_to_pane(b);
            if (a_div && b_div) {
                return a_div.getBoundingClientRect().left - b_div.getBoundingClientRect().left;
            }
            return 0;
        });

            
        return neighbors;

    }

    // get sibling of a pane
    get_sibling(name) {
        // get parent
        let parent = this.find_node(name).parent;
        let sibling = null;
        for (let child of parent.children) {
            if (child.name !== name) {
                sibling = child;

            }
            console.log(child.name)
        }
        return sibling;
    }

    sibling_direction(name) {
        // get pane
        let pane = this.find_node(name);

        // get parent
        let parent = pane.parent;

        // get sibling
        let sibling = this.get_sibling(name);

        // if parent is a vertical split
        if (parent.name.includes("vertical")) {
            // get index of sibling
            let index = parent.children.findIndex(child => child.name === sibling.name);
            // check if sibling is to the left or right
            if (index < parent.children.findIndex(child => child.name === name)) {
                return "left";
            } else {
                return "right";
            }
        }

        // if parent is a horizontal split
        if (parent.name.includes("horizontal")) {
            // get index of sibling
            let index = parent.children.findIndex(child => child.name === sibling.name);
            // check if sibling is to the up or down
            if (index < parent.children.findIndex(child => child.name === name)) {
                return "up";
            } else {
                return "down";
            }
        }
    }

    // delete a pane
    remove_pane(name) {
        if (name === this.root.name) {
            console.log("Can not remove root pane");
            return
        }

        // get split parent
        let parent = this.find_node(name).parent;

        // get the parent of the split
        let grand_parent = parent.parent;

        // get the index of the parent in the grand parent
        let index = grand_parent.children.findIndex(child => child.name === parent.name);

        // remove the pane from the parent
        this.remove_node(name);

        // get siblings of the pane being removed
        // Note that it should not be the pane being removed
        let sibling = this.get_sibling(name)

        // get direction of sibling to pane being removed
        let direction = this.sibling_direction(name);
        console.log("direction:")
        console.log(direction)

        // change selected
        this.change_selected(direction);


        // log all the information:

        if (parent === this.root) {
            // make the sibling the new root
            this.root = sibling;
        
        } else {

            // move sibling to grand parent
            this.move_pane(sibling.name, grand_parent.name);

            // remove the parent
            this.remove_node(parent.name, grand_parent.name);

            // make the sibling in the same pistion as the deleted parent
            // get current index
            let sibling_index = grand_parent.children.findIndex(child => child.name === sibling.name);

            if (sibling_index !== index) {
                // switch the children positions
                let temp = grand_parent.children[index];
                grand_parent.children[index] = grand_parent.children[sibling_index];
                grand_parent.children[sibling_index] = temp;
            }
        }

        // update window
        this.update_window();
    }

    // change selected pane based on direction
    change_selected(direction) {
        let neighbors = this.get_neighbors(this.selected);
        let new_selected = null;
        switch (direction) {
            case "up":
                new_selected = neighbors.up[0];
                break;
            case "down":
                new_selected = neighbors.down[0];
                break;
            case "left":
                new_selected = neighbors.left[0];
                break;
            case "right":
                new_selected = neighbors.right[0];
                break;
        }

        if (new_selected) {
            this.selected_pane(new_selected);
        }
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

        // remove empty levels
        levels = levels.filter(level => level.length > 0)

        return levels;
    }

    // get all panes in the tree
    get_panes() {
        let panes = [];
        let levels = this.tree_to_levels();
        for (let level of levels) {
            for (let node of level) {
                if (node.name.includes("pane")) {
                    panes.push(node.name);
                }
            }
        }
        return panes;
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