// Highlight the window being selected 
// TODO will include the individual tabs in the tab too potentially
const panes_class = "pane"
const panes = document.querySelectorAll(`.${panes_class}`)

function selected_pane(pane) {
    pane.addEventListener('click', () => {
        alert(`A div with class was selected!`);
    });
}

panes.forEach(pane => selected_pane(pane));
