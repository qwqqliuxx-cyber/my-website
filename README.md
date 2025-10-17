
# Gemini Game World - Deployment Guide

This document provides three distinct methods for deploying this React web application.

**Important Prerequisite:** Before any deployment, you need to build the application. This process compiles the React/TypeScript code into static HTML, CSS, and JavaScript files that browsers can understand.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Build the Project:**
    ```bash
    npm run build
    ```
This command creates a `dist` (or `build`) folder in your project root. This folder contains all the static files you need to deploy.

---

### Method 1: Windows Deployment (for Local/Testing)

This method is suitable for local testing or running on a Windows machine that acts as a server, typically using IIS (Internet Information Services).

**Steps:**

1.  **Enable IIS:**
    *   Go to `Control Panel` -> `Programs` -> `Turn Windows features on or off`.
    *   Check the box for `Internet Information Services` and ensure `World Wide Web Services` is also checked. Click OK.

2.  **Build Your React App:**
    *   Follow the prerequisite steps above to create the `dist` folder.

3.  **Deploy to IIS:**
    *   Open `IIS Manager` (search for it in the Start Menu).
    *   In the `Connections` pane on the left, expand your server node, right-click on `Sites`, and select `Add Website`.
    *   **Site name:** Choose a name (e.g., `GeminiGameWorld`).
    *   **Physical path:** Browse to and select the `dist` folder generated in the build step.
    *   **Binding:** Choose an IP address and a port (e.g., port 8080 if port 80 is in use).
    *   Click `OK`.

4.  **Install URL Rewrite Module (Crucial for React Router):**
    *   React Router's `HashRouter` (which this app uses) works out-of-the-box. However, if you were using `BrowserRouter`, you would need to handle client-side routing.
    *   Download and install the IIS URL Rewrite module from the official Microsoft website.
    *   In the `dist` folder, create a file named `web.config` with the following content. This redirects all requests to `index.html`, allowing React Router to handle the URL.
      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <configuration>
        <system.webServer>
          <rewrite>
            <rules>
              <rule name="React Routes" stopProcessing="true">
                <match url=".*" />
                <conditions logicalGrouping="MatchAll">
                  <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                </conditions>
                <action type="Rewrite" url="/" />
              </rule>
            </rules>
          </rewrite>
        </system.webServer>
      </configuration>
      ```

5.  **Access Your Site:**
    *   Open a web browser and navigate to `http://localhost:[your_port]`.

---

### Method 2: Linux Server Deployment (Production)

This is a standard production approach using Nginx, a high-performance web server.

**Prerequisites:**
*   A Linux server (e.g., Ubuntu 20.04).
*   Nginx installed (`sudo apt update && sudo apt install nginx`).
*   Your domain name pointed to the server's IP address.

**Steps:**

1.  **Build Your React App:**
    *   Create the `dist` folder on your local machine.

2.  **Upload Files to Server:**
    *   Use a tool like `scp` or `rsync` to securely copy the contents of the `dist` folder to your server. A common location is `/var/www/yourdomain.com`.
    *   Example using `scp`:
        ```bash
        scp -r dist/* user@your_server_ip:/var/www/yourdomain.com/
        ```

3.  **Configure Nginx:**
    *   Create a new Nginx configuration file for your site:
        ```bash
        sudo nano /etc/nginx/sites-available/yourdomain.com
        ```
    *   Add the following configuration. This tells Nginx to serve your static files and to redirect all other requests to `index.html` for React Router to handle.

        ```nginx
        server {
            listen 80;
            server_name yourdomain.com www.yourdomain.com;

            root /var/www/yourdomain.com;
            index index.html;

            location / {
                try_files $uri /index.html;
            }
        }
        ```

4.  **Enable the Site:**
    *   Create a symbolic link from `sites-available` to `sites-enabled`:
        ```bash
        sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
        ```
    *   Test the Nginx configuration for errors:
        ```bash
        sudo nginx -t
        ```
    *   If the test is successful, restart Nginx to apply the changes:
        ```bash
        sudo systemctl restart nginx
        ```

5.  **Set up SSL (Recommended):**
    *   Use Certbot to easily get a free SSL certificate from Let's Encrypt.
    *   ```bash
      sudo apt install certbot python3-certbot-nginx
      sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
      ```

---

### Method 3: Serverless Cloud Deployment (Vercel/Netlify)

This is the most modern, cost-effective, and hassle-free approach for hosting frontend applications. It requires no server management.

**Why this is often the best choice:**
*   **No Server Management:** You don't need to configure, update, or secure a server.
*   **Global CDN:** Your site is automatically distributed across the globe, making it fast for all users.
*   **CI/CD Built-in:** Connect your Git repository (GitHub, GitLab, etc.), and it automatically builds and deploys your site on every push.
*   **Generous Free Tiers:** Often free for personal projects and small teams.

**Steps (Using Vercel as an example):**

1.  **Push Code to a Git Repository:**
    *   Initialize a git repository in your project folder.
    *   Create an account on GitHub (or similar) and push your code to a new repository.

2.  **Sign up for Vercel:**
    *   Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.

3.  **Import and Deploy Project:**
    *   On your Vercel dashboard, click `Add New...` -> `Project`.
    *   Import the Git repository you just created.
    *   Vercel will automatically detect that it's a React project (using Vite or Create React App). The default settings are usually correct:
        *   **Framework Preset:** Vite/Create React App
        *   **Build Command:** `npm run build`
        *   **Output Directory:** `dist`
    *   Click `Deploy`.

4.  **Done!**
    *   Vercel will build and deploy your application. In a minute, you'll have a live URL for your site. Any future `git push` to your main branch will trigger a new deployment automatically.

---

### Recommendation

For a project like this, the **Serverless Cloud Deployment (Method 3)** is highly recommended.

*   **Ease of Use:** It's by far the easiest and fastest way to get a production-ready website online.
*   **Scalability & Performance:** The global CDN provides excellent performance without any configuration on your part.
*   **Cost-Effectiveness:** It's free to start and scales affordably.
*   **Development Workflow:** The integration with Git (CI/CD) streamlines the development and deployment process immensely.

Methods 1 and 2 are still valuable for specific use cases (e.g., corporate environments with existing infrastructure or complex server-side requirements), but for most modern frontend projects, the serverless approach is superior.
   