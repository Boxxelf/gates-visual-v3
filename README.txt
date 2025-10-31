How to Run This Website:

1.  Create a new folder (e.g., "calculus_flowchart").
2.  Inside that folder, create the four files listed above:
    - index.html
    - style.css
    - app.js
    - graph_data.json
3.  Copy and paste the code I provided into the correct files.
4.  **IMPORTANT:** You cannot run this by just double-clicking "index.html".
    Modern browsers block loading local JSON files (like graph_data.json) for security reasons (CORS policy).
5.  You MUST run this from a simple, local web server. The easiest way is using Python:

    a.  Open your Terminal (Mac/Linux) or Command Prompt (Windows).
    b.  Navigate to the folder you created. Example:
        cd path/to/your/calculus_flowchart
    
    c.  Run one of the following commands (depending on your Python version):

        For Python 3:
        python -m http.server 8000

        For Python 2:
        python -m SimpleHTTPServer 8000
        
    d.  Open your web browser (Chrome, Firefox, etc.).
    e.  Go to this address:
        http://localhost:8000

You should now see your interactive Calculus Flow Chart!
