async function searchProduct() {
    const searchTerm = document.getElementById('productName').value.trim().toLowerCase();

    if (searchTerm === '') {
        alert('Ingrese un término de búsqueda válido');
        return;
    }

    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('errorMessage').textContent = '';

    try {
        const response = await fetch(`/api/products/search?q=${searchTerm}`);

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        if (data.length === 0) {
            document.getElementById('searchResults').innerHTML = '<p>No se encontraron productos</p>';
        } else {
            const productList = data.map(product => `<p>${product.name}: $${product.price}</p>`).join('');
            document.getElementById('searchResults').innerHTML = productList;
        }
    } catch (error) {
        console.error('Error al buscar productos:', error);
        document.getElementById('errorMessage').textContent = 'Ocurrió un error al buscar productos. Por favor, inténtalo de nuevo más tarde.';
    } finally {
        document.getElementById('loadingMessage').style.display = 'none';
    }
}