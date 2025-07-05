// app/api/widget/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    const product = searchParams.get('product');

    if (!address || !product) {
        return new NextResponse(
        `<html><body><h2 style="color:red;text-align:center;margin-top:20px;">Missing "address" or "product" parameter</h2></body></html>`,
        {
            status: 400,
            headers: { 'Content-Type': 'text/html' },
        }
        );
    }

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
            <p><strong>Product:</strong> ${product}</p>
            <p><strong>Wallet:</strong> ${address}</p>
            <button class="button" onclick="document.getElementById('modal').style.display = 'flex'">
            Pay with IntCash
            </button>
        </div>

        <div id="modal" class="modal">
            <div class="modal-content">
            <h3>Processing Payment...</h3>
            <p>Sending payment from <code>${address}</code> for product <code>${product}</code>.</p>
            <div class="close" onclick="document.getElementById('modal').style.display = 'none'">Cancel</div>
            </div>
        </div>

        <script>
            // Basic modal toggle logic already inline
        </script>
        </body>
        </html>
    `;

    return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });
}
