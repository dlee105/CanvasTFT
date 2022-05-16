# Canvas Tools For Teachers
Repository for UCI INF191 Capstone Project (Sponsor: Professor Bietz, Fall 2021/Winter 2022)

Project Description: For context, Canvas is a edTech service that has been heavily utilized by instructors across the UC Irvine campus and many other academic institutions. Given Canvas’ mission to improve & amplify the value of student success, this platform provides robust tools for teaching staff to develop & administer coursework, and manage student learning. Despite being a fairly powerful online learning tool, there still exists an opportunity for Canvas’ room for growth & improvement. Our design solution is a web-based platform (built with React, Node.JS, Express) that houses a wide set of tools that make use of the Canvas LMS REST API, in order to give instructors a more streamlined means of carrying out operations in the existing Canvas Learning Management System (LMS).

It's important to note that our software is not sponsored nor endorsed by Instructure, the developer and publisher of Canvas LMS. Canvas Tools For Teachers is a third-party tool designed to enhance Canvas’ performance among their target user base.
<br/>
<br/>



# Setting up the workspace (only done once)
1. Open a new Terminal (bash) and navigate to the server folder, "canvas-tools-backend", in the Terminal 
2. Run the command `npm install`: [installation instructions if you don't have npm and node.js installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Repeat the above steps within the client folder, "canvas-tools-for-teachers"

NOTE: You must change working directories (`cd` command in git) in order to navigate to the above folders.
<br/>



# Running the application (must be done in order)
1. Open a new Terminal (bash) and navigate to the server folder and run the command `npm start` 
2. Open another Terminal (bash) and navigate to the client folder in the Terminal and run the command `npm start` to fire up the client
3. Once you have the page up & running (for reference, "start.js" is the root page), scroll down and click on "How do I get started?".
4. From here, enter `https://canvas.instructure.com` in the input field titled "your institution's Canvas URL".
5. Enter `7~rr5ujAtENnOW9GfFkjOHG6mcaXvvDMdp8yI1wehwL0Gr8UOMduOpl3D0hPEaylK5` in the input field titled "your unique access token". Please note that this token may have expired so it's best to generate a new one by logging into the instructor account (see associated spreadsheet for account credentials) and navigating to the account's profile settings to generate a new access token.
6. Follow the rest of the listed steps on that page. Once finished, you will be redirected to the home page where all of the tools are displayed.

NOTE: The keys that you have inputted (i.e. Canvas URL & access token) are required to run live Canvas API calls. For more information, refer to the linked documentation under "Acknowledgements" (listed below).
<br/>
<br/>



# Acknowledgements (i.e. packages installed, references for documentation, etc.)
- [Canvas LMS REST API - Live](https://canvas.eee.uci.edu/doc/api/live)
- [Rsuite - Open-source design library for UI components](https://rsuitejs.com/components/overview/)
- [Bootstrap - Open-source design library for UI components](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- ['Vega-Lite' npm package to run interactive graphs & build data visualizations within some of the provided tools](https://vega.github.io/vega-lite/)
- ['Less' npm package to override Rsuite default CSS styling](https://lesscss.org/#)
- ['Less Watch Compiler' npm package to override Rsuite default CSS styling](https://www.npmjs.com/package/less-watch-compiler)
- [Reference for overall repository structure](https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61).
- [Reference for src folder structure](https://www.taniarascia.com/react-architecture-directory-structure/)

