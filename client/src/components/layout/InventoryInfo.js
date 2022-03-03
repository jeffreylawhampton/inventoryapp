import React from "react";

const InventoryInfo = ({ developerClickHandler }) => {
  return (
    <div className="grid-x grid-margin-x hero">
      <div className="cell small-12">
        <h1>About Inventory</h1>
        <p>
          Inventory is <a onClick={developerClickHandler}>Jeff Hampton's</a> Launch Academy
          breakable toy/capstone project, born out of a request from a mom overflowing with craft
          supplies who needed a way to track what she had and where. (Hence the "Invent" in
          Inventory. It kinda works.)
        </p>
        <p>
          I also knew from working at a series of insurtech startups that having your possessions
          documented is a necessity if and when it comes time to file a renters or homeowners
          insurance claim. You can use Inventory for either purpose, or both, or something else
          entirely. I'm not the boss of you. But I do have some tips:
        </p>

        <h3>Filtering by rooms and categories</h3>
        <img
          src="https://jh-inventory-app-production.s3.amazonaws.com/1646337698006"
          alt="Click on the item count to show items in a room or category"
          className="info-gif"
        />
        <p>
          The room and category tiles have a number that indicates how many items belong to that
          room or category. Clicking on the item count will expose a list with clickable links to
          the item pages, while clicking on the right side of the tile will bring you to the
          room/category page.
        </p>
        <h3>Adding and editing rooms and categories</h3>
        <img
          src="https://jh-inventory-app-production.s3.amazonaws.com/1646339950961"
          alt="Click the plus icon to add a room or category"
          className="info-gif"
        />
        <p>
          You can add a new room or category from the room or category list pages by clicking the
          plus icon in the bottom left. Categories (and the items that belong to them) are
          color-coded.
        </p>
        <p>
          From the room or category show page, you can add an existing item by clicking the plus
          icon, or edit the name by clicking the edit link under the name.
        </p>

        <h3>Adding, moving, and editing items</h3>
        <img
          src="https://jh-inventory-app-production.s3.amazonaws.com/1646341925744"
          alt="Click the plus icon to add a room or category"
          className="info-gif"
        />
        <p>
          You can add a new room or category from the room or category list pages by clicking the
          plus icon in the bottom left. Categories (and the items that belong to them) are
          color-coded.
        </p>
        <h2>What's next?</h2>
        <h5>Nested containers</h5>
        <p>
          First on the list is the ability to add storage containers to rooms that can be infinitely
          nested for precise location tracking. So, for example, you might have a set of shelves
          that each contain containers that each contain containers, sort of like a file tree. You
          get the idea.
        </p>
        <h5>Drag and drop</h5>
        <p>
          You'll be able to drag and drop to nest and un-nest containers, move them from room to
          room, or drag items from one category to another.
        </p>
        <h5>Multiple image uploading</h5>
        <p>
          Sometimes one just isn't enough. I'll be adding an image carousel so you can include
          pictures of an item from multiple angles, add a picture of a receipt, and more.
        </p>
        <h5>More item details</h5>
        <p>Think unit cost, quantity, total value. Yada yada yada.</p>

        <h5>And the grand finale... mobile app</h5>
        <p>
          Webapps are great and all, but Inventory makes the most sense as a mobile app with local
          storage. You'll still be able to sync to the cloud, but you shouldn't need internet access
          just to see your stuff. Inventory will be available for download as an APK just as soon as
          I learn how to use React Native and generate APKs.
        </p>
      </div>
    </div>
  );
};

export default InventoryInfo;
