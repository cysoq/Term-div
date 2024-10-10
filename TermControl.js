import { TermTree } from "./TermTree.js";

const tree = new TermTree();
// split root pane

document.addEventListener('keydown', function(event) {
    // Splitting Vertical
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
        event.preventDefault(); // Prevent the default action if needed
        // TODO 
        console.log(tree.selected)
        tree.split_pane(tree.selected, "vertical");
        console.log(tree.print_tree());
        tree.update_window();
    }
    // Splitting Horizontal
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyO') {
        event.preventDefault(); // Prevent the default action if needed

        // TODO
        console.log(tree.selected)
        tree.split_pane(tree.selected, "horizontal");
        console.log(tree.print_tree());
        tree.update_window(); 
    }

    if (event.ctrlKey && event.shiftKey && event.code === 'KeyV') {
        event.preventDefault(); // Prevent the default action if needed
        import_pane_config(export_pane_config())
    }    
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyX') {
        event.preventDefault(); // Prevent the default action if needed
        console.log("Remove Pane")
        // TODO 
    }    
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
        event.preventDefault(); // Prevent the default action if needed
        console.log("Pane Information")
        // TODO 
    }    

    // Changing Panes
    if (event.altKey && event.code === 'ArrowUp') {
        event.preventDefault(); // Prevent the default action if needed
        // TODO 
    }

    if (event.altKey && event.code === 'ArrowDown') {
        event.preventDefault(); // Prevent the default action if needed
        // TODO 
    }

    if (event.altKey && event.code === 'ArrowLeft') {
        event.preventDefault(); // Prevent the default action if needed
        // TODO 
    }

    if (event.altKey && event.code === 'ArrowRight') {
        event.preventDefault(); // Prevent the default action if needed
        // TODO 
    }
});