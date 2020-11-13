import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import ShowProducts from "./components/ShowProducts";
import EditProduct from "./components/EditProduct";

import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				{/* <Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/addProduct">
					<AddProduct />
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/register">
					<Register />
				</Route>
				<Route exact path="/productList">
					<ShowProducts />
				</Route>
				<Route exact path="/editProduct/:id">
					<EditProduct />
				</Route> */}
				<Route exact path="/" component={Home} />

				<Route exact path="/addProduct" component={AddProduct} />

				<Route exact path="/login" component={Login} />

				<Route exact path="/register" component={Register} />

				<Route exact path="/productList" component={ShowProducts} />

				<Route exact path="/editProduct/:id" component={EditProduct} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
