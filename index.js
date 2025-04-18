import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import path from 'path';
import fs from 'fs';



const outputFilePath = path.join(process.cwd(), 'wishlist.json');

async function main() {
    //const rl = readline.createInterface({ input, output });
    //TODO 1: Read user input
    //const answer = await rl.question("Type the number according to Menu option ");
    while(true){
        console.log('');
        console.log('📌 Welcome to the Wishlist Tracker!');
        console.log('Please choose an option from the menu below:');
        console.log('1. Add items to wishlist.');
        console.log('2. View all wishlist items.');
        console.log('3. Edit item by ID.');
        console.log('4. Delete item by ID.');  
        console.log(''); 
        const answer = await getUserAnswer("MyWishList:~/ ");
        //TODO 2: switch to current case
        if(answer === "quit"){
            console.log("bye");
            break;
        }
        const standBy = await selectMenuOption(answer); 
    }
     
}

async function getUserAnswer(msg) {
    const rl = readline.createInterface({ input, output });
    //TODO 1: Read user input
    const answer = await rl.question(msg);
    rl.close();
    return answer;
}

async function selectMenuOption(answer) {
    //select case base in answer
    switch (answer) {
        case "1": {
            console.log('Add items to wishlist.');
            await addItem();
            break;
        }
        case "2": {
            console.log('View all wishlist items.');
            await listAllItems(outputFilePath);
            break;
        }
        case "3": {
            console.log('Edit item by ID');
            await editItemById();
            break;
        }
        case "4": {
            console.log('Delete item by ID');
            await deleteItemById();
            break;
        }
        default: {
            console.log(`The ${answer} option is not available.`);
        }
    }
}

async function addItem() {
    try {
        const name_ =  await getUserAnswer("Name item: ~:/ ");
        const price_ = await getUserAnswer("Price item: ~:/ ");
        const store_ = await getUserAnswer("Store item: ~:/ ");
        //read current data and convert to object
        const receivedData = JSON.parse(await readFile(outputFilePath));
        //new item object id must be generate auto from last index
        const newItem = {
            id: receivedData.wishlist.lastIndex + 1,
            name: name_,
            price: Number(price_),
            store: store_
        }
        receivedData.wishlist.lastIndex++;
        //add new item to wishlist items
        receivedData.wishlist.items.push(newItem);

        

        //write into to wishlist.json
        await writeContentToFile(receivedData);

    } catch (err) {
        console.error("Some error\n ", err.message);
    }

    return 1;
}
//TODO 3: get file results and list it in screen
async function listAllItems(filePath) {
    //using promises mixing with async 
    // readFile(filePath).then((chunk)=>{
    //     console.log('--- File chunk start ---');
    //     console.log(chunk);
    //     console.log('--- File chunk end ---');
    // }
    // );
    //(async function () {
        try {
            const receivedData = JSON.parse(await readFile(filePath));
            // console.log('--- File chunk start ---');
            //console.log(receivedData.wishlist.items);
            if(receivedData.wishlist.items.length===0){console.log("Sorry no items.")}
            else{
                console.log(`*******************************************${receivedData.wishlist.header}*************************************`);
            receivedData.wishlist.items.forEach(item => {
                console.log(`Id: ${item.id}\nname: ${item.name}\nprice: ${item.price}\nstore: ${item.store}`);
                console.log(`*******************************************************************************************`);

            });
            }
            // console.log('--- File chunk end ---');

        } catch (err) {
            console.error(err.message);
        }
    //})();
}

//Edit an existing item

async function editItemById() {

    try {
        const id = await getUserAnswer("Item Id: ~:/ ");

        const receivedData = JSON.parse(await readFile(outputFilePath));
        
        let old_name,old_price,old_store,current_index=null;
        if(receivedData.wishlist.items.length===0){console.log("Sorry no items.")}
        receivedData.wishlist.items.forEach(async (item,index) => {
           console.log(typeof(item.id),typeof(id));
            if (item.id === Number(id)) {
                //console.log(`id${item.id} modified with ${JSON.stringify(item)} ${id}`);
                // item.name = name_;
                // item.price = price_;
                // item.store = store_;
                old_name= item.name;
                old_price= item.price;
                old_store= item.store;
                current_index = index;
            }
        });
        if(current_index!=null){
            const name_ =  await getUserAnswer(`Old name item: '${old_name}' ~:/ `);
            const price_ = await getUserAnswer(`Old Price item: '${old_price}' ~:/ `);
            const store_ = await getUserAnswer(`Old Store item: '${old_store}' ~:/ `);
    
            receivedData.wishlist.items[current_index].name = name_;
            receivedData.wishlist.items[current_index].price = price_;
            receivedData.wishlist.items[current_index].store = store_;
          
            
            //await writeContentToFile(receivedData);
            await writeContentToFile(receivedData);
        }else{
            console.log(`No item with id: ${id}`);
        }

    } catch (err) {
        console.error(err.message);
    }
}

async function deleteItemById() {
    

    try {
        const id = await getUserAnswer("Item Id: ~:/ ");
        const receivedData = JSON.parse(await readFile(outputFilePath));
        if(receivedData.wishlist.items.length===0){console.log("Sorry no items.")}
        else{
            let itemToDelete = null;

            receivedData.wishlist.items.forEach((item,index) => { if (item.id === Number(id)) {itemToDelete = index;}});
            // remove id element
            
            if(itemToDelete != null){
                const newArrayOfItems = [...receivedData.wishlist.items];
                newArrayOfItems.splice(itemToDelete,1);
                receivedData.wishlist.items = [...newArrayOfItems];
                await writeContentToFile(receivedData);
            }else{
                console.log(`No item with id: ${id}`);
            }
        }

    } catch (err) {
        console.error(err.message);
    }
}

//TODO 4: use readFile method
async function readFile(filePath) {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    try {
        for await (const chunk of readStream) {
            // console.log('--- File chunk start ---');
            // console.log(chunk);
            // console.log('--- File chunk end ---');
            return chunk;
        }
        
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
    }
}

async function writeContentToFile(content) {
    
    try {
        console.log("Writting ...");
        await fs.writeFileSync(outputFilePath, JSON.stringify(content));
        console.log("Saved.");
    } catch (err) {

        console.log("Error writing wishlist.json\n", err);
        return 0;
    }
}


main();