import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthProtected = ({ children }) => {
  // const AuthProtected = () => {
  // console.log("useSelector", useSelector);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userRole = useSelector((state) => state.authorise.userRole);

  // console.log("AuthProtected - User Role:", userRole);
  // console.log("AuthProtected - Access Token:", accessToken);

  if (accessToken) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };

// import React from "react";
// import { Navigate, Route } from "react-router-dom";
// import { useSelector } from "react-redux";

// const AuthProtected = (props) => {
//   const { accessToken, refreshToken } = useSelector((state) => state.auth);
//   // const userRole = localStorage.getItem("Authorise");
//   if (accessToken && refreshToken) {
//     return <>{props.children}</>;
//   } else {
//     return (
//       <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
//     );
//   }
// };

// const AccessRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         return (
//           <>
//             {" "}
//             <Component {...props} />{" "}
//           </>
//         );
//       }}
//     />
//   );
// };

// export { AuthProtected, AccessRoute };
