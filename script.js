// Get references to DOM elements
const itemInput = document.getElementById('itemInput');
const shoppingForm = document.getElementById('shoppingForm');
const filterInput = document.getElementById('filterInput');
const shoppingList = document.getElementById('shoppingList');
const clearBtn = document.getElementById('clearBtn');
const errorMessage = document.getElementById('error-message');

// function to add an item to the shopping list
const addItem = (e) => {
  e.preventDefault();
  const itemName = itemInput.value;
  if (itemName === '') {
    errorMessage.textContent =
      'Item name cannot be empty. Please enter an item.';
    return;
  }

  // Create a new list item
  const listItem = document.createElement('li');
  listItem.innerHTML = `<span class="item-text">${itemName}</span>
  <button class="editBtn">Edit</button>
  <button class="removeBtn">Remove</button>`;

  // Add the list item to the shopping list
  shoppingList.appendChild(listItem);

  // Clear the input field
  itemInput.value = '';

  // save item to local storage
  saveItemsToLocalStorage();

  // Put the items into edit mode
  const editBtn = listItem.querySelector('.editBtn');
  editBtn.addEventListener('click', () => {
    enterEditMode(listItem);
  });
};

// function to handle item clicks (edit or remove)
const handleItemClick = (e) => {
  if (e.target.classList.contains('removeBtn')) {
    e.target.parentElement.remove();
    saveItemsToLocalStorage();
  } else if (e.target.classList.contains('editBtn')) {
    enterEditMode(e.target.parentElement);
  }
};

// function to enter edit mode
function enterEditMode(li) {
  const itemText = li.querySelector('.item-text');
  const editedText = prompt('Edit item:', itemText.textContent);

  if (editedText !== null) {
    itemText.textContent = editedText;
    saveItemsToLocalStorage();
  }
}

// function to filter items
function filterItems() {
  const filterText = filterInput.value.toLowerCase();
  const items = Array.from(shoppingList.children);

  items.forEach((item) => {
    const itemText = item.querySelector('.item-text').textContent.toLowerCase();
    if (itemText.includes(filterText)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

//function to clear all items
const clearList = () => {
  shoppingList.innerHTML = '';
  saveItemsToLocalStorage();
};

// function to save items to local storage
const saveItemsToLocalStorage = () => {
  const items = Array.from(shoppingList.children).map(
    (item) => item.querySelector('.item-text').textContent
  );
  localStorage.setItem('shoppingItems', JSON.stringify(items));
};

// Function to load items from local storage
const savedItems = JSON.parse(localStorage.getItem('shoppingItems')) || [];
savedItems.forEach((itemText) => {
  const li = document.createElement('li');
  li.innerHTML = `
        <span class="item-text">${itemText}</span>
        <button class="editBtn">Edit</button>
        <button class="removeBtn">Remove</button>
    `;
  shoppingList.appendChild(li);

  const editBtn = li.querySelector('.editBtn');
  editBtn.addEventListener('click', () => enterEditMode(li));
});

// Add event listeners
shoppingForm.addEventListener('submit', addItem);
shoppingList.addEventListener('click', handleItemClick);
filterInput.addEventListener('input', filterItems);
clearBtn.addEventListener('click', clearList);
