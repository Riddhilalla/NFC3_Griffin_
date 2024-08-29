async function getWishlist() {
    const userId = 'user-id-here'; // Replace with actual user ID
    const response = await fetch(`/api/wishlist/${userId}`);
    const wishlist = await response.json();

    const wishlistContainer = document.getElementById('wishlist');
    wishlistContainer.innerHTML = '';

    wishlist.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} - $${item.price}`;
        wishlistContainer.appendChild(itemDiv);
    });
}

async function addItem() {
    const userId = 'user-id-here'; // Replace with actual user ID
    const productId = document.getElementById('product-id').value;

    await fetch(`/api/wishlist/${userId}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    });

    getWishlist();
}

async function shareWishlist() {
    const userId = 'user-id-here'; // Replace with actual user ID
    const sharedUserId = document.getElementById('shared-user-id').value;

    await fetch(`/api/wishlist/${userId}/share`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sharedUserId })
    });
}

document.addEventListener('DOMContentLoaded', getWishlist);
