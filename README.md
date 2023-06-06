# YelpCamp

YelpCamp is a full-stack web application that serves as a listing website (like Yelp.com) specifically designed for campsites. It allows users to browse, create, and review campgrounds, providing a comprehensive platform for camping enthusiasts. This project was developed during my summer vacations as an opportunity to build a complete full-stack project utilizing multiple services.

**Check it out->** [YelpCamp](https://yelpcamp-76c6.onrender.com/)

**Note:** While the app is fully responsive, please be aware that it may not be optimized for smaller displays such as phones. Some sections, particularly the campground show pages with lengthy descriptions, may appear cramped. For the best experience, it is recommended to view the website on a larger screen or in landscape orientation on a mobile device.

## Features

1. **User Authentication & Authorization:** Users can register on the website to authenticate themselves. Logging in grants authorization to perform various tasks.
2. **Campground Creation:** Authorized users can create new campgrounds, providing comprehensive details and images.
3. **Campground Ownership:** Only the owner of a campground has the ability to edit the information and details associated with it.
4. **User Comments:** Registered users can leave comments on any campground, enabling community engagement and sharing experiences.
5. **Comment Management:** Users who have authored a comment have the ability to delete their own comments.
6. **Location Mapping:** All campgrounds listed on the website have their locations displayed on a map within their respective show pages.
7. **Cluster Map:** The index page features a cluster map that shows all campgrounds at once. Campsites that are closer together are grouped according to the zoom level, providing a better viewing experience.

## Technology Used

1. **Node.js:** The application is built on Node.js, a JavaScript runtime environment.
2. **Express.js:** Server-side scripting is done using Express.js, a fast and minimalist web application framework for Node.js.
3. **MongoDB Atlas:** The cloud database manager used for YelpCamp. It is connected to the application through Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js.
4. **Cloudinary:** Images associated with the campgrounds are saved on the cloud using Cloudinary, a cloud-based image and video management service.
5. **MapBox WebGL JS:** MapBox is utilized to display the maps, including the cluster map, providing an interactive and visually appealing experience.
6. **Bootstrap:** The web application is styled and made responsive using Bootstrap, a popular front-end framework.
7. **EJS:** Dynamic HTML views are created using EJS (Embedded JavaScript), a simple templating language that allows embedding JavaScript code within HTML markup.
8. **Joi:** Joi is used for form validation, ensuring that user-submitted data meets the specified requirements.
9. **Passport.js:** Passport.js is employed for user authentication, providing a secure and flexible authentication middleware for Node.js.
10. **Sanitize-html** and **Helmet:** These libraries are utilized to enhance the security of the web application, protecting against vulnerabilities such as MongoDB injection and cross-site scripting.

Feel free to explore YelpCamp and experience the joy of camping through this interactive platform! If you encounter any issues or have suggestions for improvements, please don't hesitate to reach out. Happy camping!

Contact me at: siddhantyadav999@gmail.com
