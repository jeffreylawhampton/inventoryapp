# Inventory

Inventory helps anyone who's long on stuff and short on memory keep track of what they have and where. To see a demo account with seeded example items, visit https://inventory-app-jh.herokuapp.com/ and use the credentials below.

Email: demoaccount@notarealemail.com

Password: u2cy8qvd

![image](https://drive.google.com/uc?id=1tcZiBgY31k3H2lguftTvfQRgRHCMqcJZ)

## Technologies

Inventory was created with:

- Node.js
- Express
- React.js
- Generator\-Engage
- Passport
- React Dropzone
- Multer

## Development Setup

#### Requirements

- yarn
- node.js

#### Setup

```
$ git clone https://github.com/jeffreylawhampton/inventoryapp.git
$ cd inventoryapp
$ yarn install
$ createdb inventoryapp_development
$ cd inventoryapp_development
$ cd server
$ yarn migrate:latest
$ yarn db:seed
$ yarn dev
```

## To-dos and upcoming features

- Adding nested containers to rooms for precise tracking
- Adding more item information, like unit cost and total value
- Drag-and-drop items to categories, rooms, and containers
- Multiple image upload for receipt tracking
- Profile page and password updating

## How to use Inventory

However you want. We're not the boss of you. But here are some suggestions:

#### Finding items

https://drive.google.com/file/d/1Br_h2Hw--Sz6nZMlbkyNiVUJP3PfiRmu/view?usp=sharing
Type the name of an item to filter the results. You can view the current location of the item on the tile. Clicking it will bring you to the item show page, where you can edit item details.

#### Adding and editing items

https://drive.google.com/file/d/1LFO-xH7g58IHzKAg8ZOwkic8xrtALClc/view?usp=sharing
Click the plus icon to add a new item. From the item page, you can move it quickly from the link in the header by clicking the move link, or click the edit icon in the bottom left to edit the details.

#### Adding and editing categories

https://drive.google.com/file/d/1ez9zxjYjt8vJWHiO9oAqKxfVh-DohmM3/view?usp=sharing
To add a new category, click the plus icon in the bottom left. Categories and their items are color coded. To add an item to a category, click the category card to visit the show page, then the plus icon to select an item to move.

#### Viewing categories and rooms

https://drive.google.com/file/d/1Br_h2Hw--Sz6nZMlbkyNiVUJP3PfiRmu/view?usp=sharing
The number on the left of a tile shows how many items a category or room has. Clicking it will expand the tilo show the items with links. Clicking on the right portion of the tile will direct you to the category/room show page.
