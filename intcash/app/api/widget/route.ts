// app/api/widget/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
        return new NextResponse(
            `<html><body><h2 style="color:red;text-align:center;margin-top:20px;">Missing "address" parameter</h2></body></html>`,
            {
                status: 400,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    }

    // All available products (normally from DB/config)
    const allProducts = [
        { name: 'Pro Subscription', id: 'pro' },
        { name: 'E-Book Download', id: 'ebook' },
        { name: 'Premium Feature Unlock', id: 'premium' },
        { name: 'Advanced Course', id: 'course' },
    ];

    // Filter products based on ?products[]=id1&products[]=id2...
    const productIds = searchParams.getAll('products[]');
    const filteredProducts = productIds.length
        ? allProducts.filter(p => productIds.includes(p.id))
        : allProducts;

    if (filteredProducts.length === 0) {
        return new NextResponse(
            `<html><body><h2 style="color:red;text-align:center;margin-top:20px;">No valid products found in query</h2></body></html>`,
            {
                status: 400,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    }

    const productOptions = filteredProducts
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join('');

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Pay with IntCash</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        
            <div class="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
                <h2 class="text-2xl font-semibold mb-2">Pay with IntCash</h2>
                <p class="text-sm text-gray-600 mb-4"><strong>Vendor:</strong> ${address}</p>
        
                <label for="product-select" class="block text-left text-sm font-medium text-gray-700 mb-1">Choose a product:</label>
                <select id="product-select" class="w-full border border-gray-300 rounded-lg p-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    ${productOptions}
                </select>
        
                <button class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200" onclick="startPayment()">
                    Pay with IntCash
                </button>
            </div>
        
            <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white p-6 rounded-2xl shadow-lg text-center w-11/12 max-w-sm" id="modal-content">
                    <h3 class="text-lg font-semibold text-gray-800">Processing Payment...</h3>
                    <p class="mt-2 text-sm text-gray-600" id="modal-msg">Sending payment...</p>
                    <div class="mt-4 text-sm text-blue-600 cursor-pointer hover:underline" onclick="document.getElementById('modal').style.display = 'none'">Cancel</div>
                </div>
            </div>
        
            <script>
                function onPending(product) {
                    console.log("Payment is pending for", product);
                    document.getElementById('modal-msg').innerHTML = \`Sending payment from <code>${address}</code> for product <code>\${product}</code>.\`;
                }
        
                function onSuccess(product) {
                    document.getElementById('modal-content').innerHTML = \`
                        <h3 class="text-lg font-semibold text-green-600">Payment Successful!</h3>
                        <p class="mt-2 text-sm text-gray-700">Thank you for purchasing <strong>\${product}</strong>.</p>
                    \`;
                    console.log("Payment succeeded for", product);
                }
        
                function onFailure(error) {
                    document.getElementById('modal-content').innerHTML = \`
                        <h3 class="text-lg font-semibold text-red-600">Payment Failed</h3>
                        <p class="mt-2 text-sm text-gray-700">\${error}</p>
                        <div class="mt-4 text-sm text-blue-600 cursor-pointer hover:underline" onclick="document.getElementById('modal').style.display = 'none'">Close</div>
                    \`;
                    console.error("Payment failed:", error);
                }
        
                function startPayment() {
                    const modal = document.getElementById('modal');
                    const productSelect = document.getElementById('product-select');
                    const selectedProduct = productSelect.options[productSelect.selectedIndex].text;
        
                    modal.style.display = 'flex';
                    onPending(selectedProduct);
        
                    setTimeout(() => {
                        const success = Math.random() > 0.3;
                        if (success) {
                            onSuccess(selectedProduct);
                        } else {
                            onFailure("Unable to process the transaction. Please try again.");
                        }
                    }, 2000);
                }
            </script>
        </body>
        </html>
        `;
        

    return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });
}
