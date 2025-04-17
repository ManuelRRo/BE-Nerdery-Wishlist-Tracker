# BE-Nerdery-Wishlist-Tracker

Challenge “Wishlist Tracker"

### Description

Create a simple command-line tool to manage a personal wishlist. Users should be able to add, view, 
update, and delete items from their wishlist, each with a name, price, and store.

### Core Requirements


**Use Node.js** (no third-party libraries, only built-in modules like `fs` and `readline`).
**Implement CRUD Operations:**
   * **Create**: Add items with name, price, and store.
   * **Read**: View all wishlist items.
   * **Update**: Edit an existing item. (Select base on incremental generated)
   * **Delete**: Remove an item. (Select base on incremental generated)
**Data Persistence**:
   * Store wishlist data in a JSON file.
   * Load and save data automatically.
**User Interface**:
   * Provide a menu-driven interface. (arguments based)
   * Handle user input and errors appropriately.


### Bonus Features

1. CSV Export: Export the wishlist to a CSV file with item name, price, and store.
2. Wishlist Summary:
   * Show the most expensive item, average price, total cost, and the number of items.