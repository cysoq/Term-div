// Highlight the window being selected 
// TODO will include the individual tabs in the tab too potentially
const panes_class = "pane"
const panes = document.querySelectorAll(`.${panes_class}`)
let activePane = null; 

let num = 1

let pane_config = {
    "name": "pane0",
    "root": true,
    "node": true,
    "orientation": null,
    "width": 100,
    "height": 100,
    "posL": 0,
    "posT": 0,
    "branch": []
}

function get_selected_pane_name() {
    return ("pane" + String(activePane.dataset.order))
}

function get_pane_name(pane) {
    return ("pane" + String(pane.dataset.order))
}

function update_pane_config(pane_config, parent, child, orientation) {
    // Base case: Check if the current pane's name matches the target name
    if (pane_config.name === parent) {

        // update pane_config to a branch
        pane_config.name = "branch"
        pane_config.node = false
        pane_config.orientation = orientation

        
        // add children
        let pane_parent = {
            "name": parent,
            "root": false,
            "node": true,
            "orientation": null,
            "width": pane_config.width,
            "height": pane_config.height,
            "posL": pane_config.posL,
            "posT": pane_config.posT,
            "branch": []
        }
        let pane_child = {
            "name": child,
            "root": false,
            "node": true,
            "orientation": null,
            "width": pane_config.width,
            "height": pane_config.height,
            "posL": pane_config.posL,
            "posT": pane_config.posT,
            "branch": [],
        }

        if (orientation == "horizontal") {
            pane_parent.height = pane_config.height * .5

            pane_child.height = pane_config.height * .5
            pane_child.posT = pane_child.posT + (pane_config.height * .5)
        } else if (orientation == "vertical") {
            pane_parent.width = pane_config.width * .5

            pane_child.width = pane_config.width * .5
            pane_child.posL = pane_config.posL + (pane_config.width * .5)

        }
        pane_config.branch.push(pane_parent)
        pane_config.branch.push(pane_child)        
        return pane_config;
    }

    // Recursively search through branch array
    for (let branchItem of pane_config.branch) {
        let foundPane = update_pane_config(branchItem, parent, child, orientation);
        if (foundPane) {
            // add child
            return foundPane; // Return if match found in the branch
        }
    }

    // Return null if no match is found in this branch
    return null;
}

function update_split_pane_config(parent, child, orientation) {
    update_pane_config(pane_config, parent, child, orientation)
}

function remove_pane_helper(pane_config, pane) {
    let found_pane = null
    pane_config.branch.forEach(childPane => {
        if (childPane.name === pane) {
            found_pane = childPane
        }
    })
    if (found_pane !== null) {
        console.log(pane_config)
        console.log(found_pane)
        return pane_config;
    }

    // Recursively search through branch array
    for (let branchItem of pane_config.branch) {
        let foundPane = update_pane_config(branchItem, pane);
        if (foundPane) {
            // add child
            return foundPane; // Return if match found in the branch
        }
    }

    // Return null if no match is found in this branch
    return null;
}

function remove_pane() {
    remove_pane_helper(pane_config, get_pane_name(activePane))
}

function get_highest_order() {
    const panes = document.querySelectorAll('.pane');

    let highest_order = -Infinity
    // Loop through each element and print its content
    panes.forEach(pane => {
        if (parseInt(pane.dataset.order) > highest_order) {
            highest_order = parseInt(pane.dataset.order)
        }
    });
    return highest_order;
}

function create_new_pane() {
    let highest_order = get_highest_order()

    var newPane = document.createElement("div");

    newPane.style.position = "absolute";
    newPane.className = "pane";  // Set class
    newPane.dataset.order = String(parseInt(highest_order) + 1)
    newPane.textContent = newPane.dataset.order;
    newPane.addEventListener('click', () => {
        selected_pane(newPane);
    });
    return newPane;
}

function adjacent_panes(selectedPane) {
    const tolerance = 1;  

    let adjacentPanes = {
        left: [],
        right: [],
        top: [],
        bottom: []
    };

    const selectedPaneRect = selectedPane.getBoundingClientRect()

    const panes = Array.from(document.getElementsByClassName("pane"));
    panes.forEach(pane => {
        if (pane != selectedPane) {
            const paneRect = pane.getBoundingClientRect()
    
            if (Math.abs(paneRect.top - selectedPaneRect.bottom) <= tolerance) {
                adjacentPanes.bottom.push(pane);
            }
            if (Math.abs(paneRect.bottom - selectedPaneRect.top) <= tolerance) {
                adjacentPanes.top.push(pane);
            }
            if (Math.abs(paneRect.left - selectedPaneRect.right) <= tolerance) {
                adjacentPanes.right.push(pane);
            }
            if (Math.abs(paneRect.right - selectedPaneRect.left) <= tolerance) {
                adjacentPanes.left.push(pane)
            }
        }
    });
    return adjacentPanes;
}

function selected_pane(pane) {
    if (activePane !== null && activePane !== pane) {
        activePane.classList.remove('selected');
    }
    activePane = pane;
    adjacent_panes(activePane);
    pane.classList.add('selected');
}

function pane_listeners(pane) {

    pane.addEventListener('click', () => {
        selected_pane(pane);
    });
}

function split_vert() {
    const term_window = document.getElementsByClassName("termWindow")[0]
    const term_window_height = term_window.offsetHeight;
    const term_window_width = term_window.offsetWidth;
    const selected_pane_height = (activePane.offsetHeight / term_window_height) * 100;
    const selected_pane_width = (activePane.offsetWidth / term_window_width) * 100;
    const selected_pane_rect = activePane.getBoundingClientRect();

    const tab = document.getElementsByClassName("tab")[0];
    const tab_rect = tab.getBoundingClientRect();

    const distance_select_from_top = ((selected_pane_rect.top - tab_rect.bottom) / term_window_height) * 100;

    const distance_select_from_left = (selected_pane_rect.left / term_window_width) * 100;
    const split_width = selected_pane_width * .5;

    // Adjust the position (top and left)
    activePane.style.position = "absolute";
    activePane.style.width = split_width + '%';  // Set width in pixels
    activePane.style.height = selected_pane_height + '%';  // Set height in pixels

    // New pane
    var newPane = create_new_pane();

    // Optionally, set some content or attributes for the div
    newPane.style.width = split_width + '%';  // Set width in pixels
    newPane.style.height = selected_pane_height + '%';  // Set height in pixels
    newPane.style.left = distance_select_from_left + split_width + '%';     // Set the left position in pixels
    newPane.style.top = distance_select_from_top + '%';
    term_window.appendChild(newPane)
    return get_pane_name(newPane)
}

function split_hor() {
    const term_window = document.getElementsByClassName("termWindow")[0];
    const term_window_height = term_window.offsetHeight;
    const term_window_width = term_window.offsetWidth;

    const selected_pane_height = (activePane.offsetHeight / term_window_height) * 100;
    const selected_pane_width = (activePane.offsetWidth / term_window_width) * 100;
    const selected_pane_rect = activePane.getBoundingClientRect();
    const distance_select_from_left = (selected_pane_rect.left / term_window_width) * 100;

    const tab = document.getElementsByClassName("tab")[0];
    const tab_rect = tab.getBoundingClientRect();

    const distance_select_from_top = ((selected_pane_rect.top - tab_rect.bottom) / term_window_height) * 100;
    const split_height = selected_pane_height * 0.5;

    // Adjust the position (top and left)
    activePane.style.position = "absolute";
    activePane.style.width = selected_pane_width + '%';  // Keep width unchanged
    activePane.style.height = split_height + '%';  // Set height to half the original

    // New pane
    var newPane = create_new_pane();

    // Optionally, set some content or attributes for the div
    newPane.style.width = selected_pane_width + '%';  // Set width unchanged
    newPane.style.height = split_height + '%';  // Set height to half the original
    newPane.style.left = distance_select_from_left + '%';  // Keep the same horizontal position
    newPane.style.top = distance_select_from_top + split_height + '%';  // Adjust top position
    term_window.appendChild(newPane);
    return get_pane_name(newPane)
}

function split(dir) {
    if (dir == "horizontal") {
        let parent = get_selected_pane_name()
        let child = split_hor()
        update_split_pane_config(parent, child, "horizontal")
    }
    else if (dir == "vertical") {
        let parent = get_selected_pane_name()
        let child = split_vert()
        update_split_pane_config(parent, child, "vertical")
    }
}

function export_pane_config() {
    const config_json_str = JSON.stringify(pane_config);
    return config_json_str
}

function get_panes_from_config_helper(pane_config, panes) {
        // Base case: Check if the current pane's name matches the target name
        if (pane_config.node === true) {
            panes.push(pane_config)
            // return pane_config;
        }
    
        // Recursively search through branch array
        for (let branchItem of pane_config.branch) {
            let foundPane = get_panes_from_config_helper(branchItem, panes);
            if (foundPane) {
                return foundPane; // Return if match found in the branch
            }
        }
}

function get_panes_from_config(pane_config) {
    let panes = []
    get_panes_from_config_helper(pane_config, panes)
    return panes
}

function import_pane_config(config_json_str) {
    const term_window = document.getElementsByClassName("termWindow")[0]
    term_window.innerHTML = "";  // Remove all panes inside the term window   

    let imported_paned_config = JSON.parse(config_json_str);
    let panes_to_add = get_panes_from_config(imported_paned_config);
    
    panes_to_add.forEach(pane => {

        // Make Pane
        var newPane = document.createElement("div");
    
        newPane.style.position = "absolute";
        newPane.className = "pane";  // Set class
        newPane.dataset.order = String(pane.name).replace("pane", "")
        newPane.textContent = "new" + newPane.dataset.order;
        newPane.addEventListener('click', () => {
            selected_pane(newPane);
        });

        // Optionally, set some content or attributes for the div
        newPane.style.width = String(pane.width) + '%';  // Set width in pixels
        newPane.style.height = String(pane.height) + '%';  // Set height in pixels
        
        if (pane.posL === 0){
            newPane.style.left = 0;  
        } else {
            newPane.style.left = String(pane.posL) + '%';  
        }

        if (pane.posT === 0){
            newPane.style.top = 0;  
        } else {
            newPane.style.top = String(pane.posT) + '%';  
        }
 
        term_window.appendChild(newPane)
    });

}

function move_panes(direction) {
    const tolerance = 1;  
    if (direction === "ArrowUp") {
        let up_panes = adjacent_panes(activePane)["top"]
        if (up_panes.length === 0) {
            return
        } else {
            let activePaneRect =  activePane.getBoundingClientRect()
            up_panes.forEach(pane => {
                // Will get leftmost top pane to go to
                let pane_rect = pane.getBoundingClientRect()
                if ((Math.abs(pane_rect.left - activePaneRect.left) <= tolerance) || (pane_rect.left < activePaneRect.left)) {
                    selected_pane(pane)
                }

            });
        }
        
    }

    if (direction === "ArrowDown") {
        let up_panes = adjacent_panes(activePane)["bottom"]
        if (up_panes.length === 0) {
            return
        } else {
            let activePaneRect =  activePane.getBoundingClientRect()
            up_panes.forEach(pane => {
                // Will get leftmost top pane to go to
                let pane_rect = pane.getBoundingClientRect()
                if ((Math.abs(pane_rect.left - activePaneRect.left) <= tolerance) || (pane_rect.left < activePaneRect.left)) {
                    selected_pane(pane)
                }

            });
        }
        
    }

    if (direction === "ArrowRight") {
        let up_panes = adjacent_panes(activePane)["right"]
        if (up_panes.length === 0) {
            return
        } else {
            let activePaneRect =  activePane.getBoundingClientRect()
            up_panes.forEach(pane => {
                // Will get Top most top pane to go to
                let pane_rect = pane.getBoundingClientRect()
                if ((Math.abs(pane_rect.top - activePaneRect.top) <= tolerance) || (pane_rect.top < activePaneRect.top)) {
                    selected_pane(pane)
                }

            });
        }
        
    }

    if (direction === "ArrowLeft") {
        let up_panes = adjacent_panes(activePane)["left"]
        if (up_panes.length === 0) {
            return
        } else {
            let activePaneRect =  activePane.getBoundingClientRect()
            up_panes.forEach(pane => {
                // Will get Top most top pane to go to
                let pane_rect = pane.getBoundingClientRect()
                if ((Math.abs(pane_rect.top - activePaneRect.top) <= tolerance) || (pane_rect.top < activePaneRect.top)) {
                    selected_pane(pane)
                }

            });
        }
        
    }

}


document.addEventListener('keydown', function(event) {
    // Splitting Panes
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
        event.preventDefault(); // Prevent the default action if needed
        split("vertical")
    }
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyO') {
        event.preventDefault(); // Prevent the default action if needed
        split("horizontal");
    }

    if (event.ctrlKey && event.shiftKey && event.code === 'KeyV') {
        event.preventDefault(); // Prevent the default action if needed
        import_pane_config(export_pane_config())
    }    
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyX') {
        event.preventDefault(); // Prevent the default action if needed
        console.log("Remove Pane")
        remove_pane()
        import_pane_config(export_pane_config())
    }    

    // Changing Panes
    if (event.altKey && event.code === 'ArrowUp') {
        event.preventDefault(); // Prevent the default action if needed
        move_panes("ArrowUp");
    }

    if (event.altKey && event.code === 'ArrowDown') {
        event.preventDefault(); // Prevent the default action if needed
        move_panes("ArrowDown");
    }

    if (event.altKey && event.code === 'ArrowLeft') {
        event.preventDefault(); // Prevent the default action if needed
        move_panes("ArrowLeft");
    }

    if (event.altKey && event.code === 'ArrowRight') {
        event.preventDefault(); // Prevent the default action if needed
        move_panes("ArrowRight");
    }
});

panes.forEach(pane => pane_listeners(pane));

// Testing Import
// const paneDataJSON = `[{"top":"0%","left":"0%","width":"50%","height":"100%","content":"\\n        "},{"top":"0%","left":"50%","width":"50%","height":"50%","content":"NEW 1"},{"top":"50.02343416213989%","left":"50%","width":"50%","height":"50%","content":"NEW 2"}]`;
// importPanePositions(paneDataJSON);