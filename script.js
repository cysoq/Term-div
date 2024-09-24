// Highlight the window being selected 
// TODO will include the individual tabs in the tab too potentially
const panes_class = "pane"
const panes = document.querySelectorAll(`.${panes_class}`)
let activePane = null; 

let num = 1

// function print_dict(myDict) {
//     for (let key in myDict) {
//         if (myDict.hasOwnProperty(key)) {
//             console.log(`${key}: ${myDict[key]}`);
//         }
//     }
// }

function adjacent_panes(selectedPane) {
    const tolerance = 1;  

    let adjacentPanes = {
        left: [],
        right: [],
        top: [],
        bottom: []
    };

    const selectedPaneRect = selectedPane.getBoundingClientRect()
    // console.log(`Selected Pane left: ${selectedPaneRect.left}, ${selectedPaneRect.right}, ${selectedPaneRect.top}, ${selectedPaneRect.bottom}`)

    const panes = Array.from(document.getElementsByClassName("pane"));
    panes.forEach(pane => {
        if (pane != selectedPane) {
            const paneRect = pane.getBoundingClientRect()
            // console.log(`Other Pane left: ${paneRect.left}, ${paneRect.right}, ${paneRect.top}, ${paneRect.bottom}`)
    
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

function exportPanePositions() {
    const term_window = document.getElementsByClassName("termWindow")[0];
    const term_window_height = term_window.offsetHeight;
    const term_window_width = term_window.offsetWidth;
    const panes = term_window.getElementsByClassName("pane");
    let paneData = [];

    for (let i = 0; i < panes.length; i++) {
        const pane = panes[i];
        const pane_rect = pane.getBoundingClientRect();

        const paneInfo = {
            top: ((pane_rect.top - term_window.getBoundingClientRect().top) / term_window_height) * 100 + '%',
            left: ((pane_rect.left - term_window.getBoundingClientRect().left) / term_window_width) * 100 + '%',
            width: (pane.offsetWidth / term_window_width) * 100 + '%',
            height: (pane.offsetHeight / term_window_height) * 100 + '%',
            content: pane.textContent  // Optional: To store the content of the pane as well
        };
        paneData.push(paneInfo);
    }

    return JSON.stringify(paneData);
}

function importPanePositions(paneDataJSON) {
    const term_window = document.getElementsByClassName("termWindow")[0];
    
    // Clear existing panes before loading
    const existingPanes = term_window.getElementsByClassName("pane");
    while(existingPanes.length > 0) {
        existingPanes[0].remove();  // Remove existing panes
    }

    // Parse the JSON
    const paneData = JSON.parse(paneDataJSON);

    // Create panes with the stored properties
    paneData.forEach((paneInfo, index) => {
        var newPane = document.createElement("div");
        newPane.className = "pane";
        newPane.style.position = "absolute";
        newPane.style.top = paneInfo.top;
        newPane.style.left = paneInfo.left;
        newPane.style.width = paneInfo.width;
        newPane.style.height = paneInfo.height;
        newPane.textContent = paneInfo.content || "Pane " + (index + 1);  // Default content or use saved content

        // Add event listener to allow selecting panes
        newPane.addEventListener('click', () => {
            selected_pane(newPane);
        });

        term_window.appendChild(newPane);
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
    var newPane = document.createElement("div");

    // Optionally, set some content or attributes for the div
    newPane.style.position = "absolute";
    newPane.className = "pane";  // Set class
    newPane.style.width = split_width + '%';  // Set width in pixels
    newPane.style.height = selected_pane_height + '%';  // Set height in pixels
    newPane.style.left = distance_select_from_left + split_width + '%';     // Set the left position in pixels
    newPane.style.top = distance_select_from_top + '%';
    newPane.textContent = "NEW " + num 
    num = num + 1;
    newPane.addEventListener('click', () => {
        selected_pane(newPane);
    });
    term_window.appendChild(newPane)
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
    var newPane = document.createElement("div");

    // Optionally, set some content or attributes for the div
    newPane.style.position = "absolute";
    newPane.className = "pane";  // Set class
    newPane.style.width = selected_pane_width + '%';  // Set width unchanged
    newPane.style.height = split_height + '%';  // Set height to half the original
    newPane.style.left = distance_select_from_left + '%';  // Keep the same horizontal position
    newPane.style.top = distance_select_from_top + split_height + '%';  // Adjust top position
    newPane.textContent = "NEW " + num;
    num = num + 1;
    newPane.addEventListener('click', () => {
        selected_pane(newPane);
    });
    term_window.appendChild(newPane);
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
        split_vert();
        // console.log(exportPanePositions());

    }
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyO') {
        event.preventDefault(); // Prevent the default action if needed
        split_hor();
        // console.log(exportPanePositions());

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