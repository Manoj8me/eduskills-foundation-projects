// import React, { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import { useSelector } from "react-redux";
// import NonAuthLayout from "../Layouts/NonAuthLayout";
// import Layout from "../Layouts";
// import { publicRoutes, authProtectedRoutes } from "./allRoutes";
// import { AuthProtected } from "./AuthProtected";

// const Index = () => {
//   const userRole = useSelector((state) => state.authorise.userRole);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!userRole);

//   useEffect(() => {
//     setIsLoggedIn(!!userRole);
//   }, [userRole, isLoggedIn]);
  
//   console.log("User Role:", userRole);
//   console.log("Is Logged In:", isLoggedIn);

//   const combinedRoutes = [
//     ...publicRoutes.map((route) => ({ ...route, type: 'public' })),
//     ...authProtectedRoutes
//       // .filter((route) => !route.roles || route.roles.includes(userRole))
//       .map((route) => ({ ...route, type: 'protected' }))
//   ];

//   return (
//     <React.Fragment>
//       <Routes>
//         {combinedRoutes.map((route, idx) => (
//           <Route
//             path={route.path}
//             element={
//               // route.type === 'public' ? (
//               //   <NonAuthLayout>{route.component}</NonAuthLayout>
//               // ) :
//                (
//                 <Layout>{route.component}</Layout>
//                 // <AuthProtected>
//                 //   <Layout>{route.component}</Layout>
//                 // </AuthProtected>
//               )
//             }
//             key={idx}
//             exact={route.exact || false}
//           />
//         ))}
//       </Routes>
//     </React.Fragment>
//   );
// };

// export default Index;
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector here

// Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import Layout from "../Layouts";

// Routes
import { publicRoutes, authProtectedRoutes } from "./allRoutes";

import { AuthProtected } from "./AuthProtected";
import { useState, useEffect } from "react";

const Index = () => {
  const userRole = useSelector((state) => state.authorise.userRole);
  const [isLoggedIn, setIsLoggedIn] = useState(!!userRole);

  useEffect(() => {
    setIsLoggedIn(!!userRole);
  }, [userRole, isLoggedIn]);

  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {authProtectedRoutes
            .filter((route) => {
              if (!route.roles) {
                return true;
              }
              return route.roles.includes(userRole);
            })
            .map((route, idx) => (
              <Route
                path={route.path}
                element={
                  <AuthProtected>
                    <Layout>{route.component}</Layout>
                  </AuthProtected>
                }
                key={idx}
                exact={true}
              />
            ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
