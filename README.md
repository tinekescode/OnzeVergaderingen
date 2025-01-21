This project was created using Copilot (with Claude 3.5 Sonnet) to see if the tool could be used to create a POC as a Product Owner or Analist whom cannot code. It work wonderly well (I describe it in this blogpost ADD URL WHEN POSTED, in Dutch).

The idea behind this research was that an non-technical person can create a small app or suggest small changes so they don't have to bother the developers with it. All they need to do is talk to Copilot and let it make the changes, test locally if it does what they want, and then make a pull request so developers can check if the code is up to standards.

Conclusion of this project is that it works well. There were two bugs that needed a bit more effort and debugging statements to fix. Just saying "It doesn't work" wasn't good enough for Copilot and I needed to specify in which step it failed. After I did that it could fix these bugs.

To run the app you need to have Node installed. Then you can just check it in and use npm install -> npm start to run the code locally.

I did not check the code for best practices and have never created a React app before. So I don't know if the code is up to standards.
