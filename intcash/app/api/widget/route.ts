// app/api/widget/payment/route.ts
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
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #f3f4f6;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .widget {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                text-align: center;
                width: 100%;
                max-width: 400px;
            }
            .button {
                background: #2563eb;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 0.75rem;
                cursor: pointer;
                font-size: 1rem;
                margin-top: 1.5rem;
            }
            select {
                margin-top: 1rem;
                padding: 0.5rem;
                border-radius: 0.5rem;
                border: 1px solid #ccc;
                width: 100%;
                font-size: 1rem;
            }
            .modal {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.4);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                text-align: center;
            }
            .close {
                margin-top: 1rem;
                font-size: 0.9rem;
                color: #666;
                cursor: pointer;
            }
        </style>
        </head>
        <body>
        <div class="widget">
            <h2>Pay with IntCash</h2>
            <p><strong>Wallet:</strong> ${address}</p>

            <label for="product-select">Choose a product:</label>
            <select id="product-select">
                ${productOptions}
            </select>

            <button class="button" onclick="startPayment()">Pay with IntCash</button>
        </div>

        <div id="modal" class="modal">
            <div class="modal-content" id="modal-content">
                <h3>Processing Payment...</h3>
                <p id="modal-msg">Sending payment...</p>
                <div class="close" onclick="document.getElementById('modal').style.display = 'none'">Cancel</div>
            </div>
        </div>

        <script>
            function onPending(product) {
                console.log("Payment is pending for", product);
                document.getElementById('modal-msg').innerHTML = \`Sending payment from <code>${address}</code> for product <code>\${product}</code>.\`;
            }

            function onSuccess(product) {
                document.getElementById('modal-content').innerHTML = \`
                    <h3 style="color:green;">Payment Successful!</h3>
                    <p>Thank you for purchasing <strong>\${product}</strong>.</p>
                \`;
                console.log("Payment succeeded for", product);
            }

            function onFailure(error) {
                document.getElementById('modal-content').innerHTML = \`
                    <h3 style="color:red;">Payment Failed</h3>
                    <p>\${error}</p>
                    <div class="close" onclick="document.getElementById('modal').style.display = 'none'">Close</div>
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
