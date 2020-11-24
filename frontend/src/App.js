import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import ShowProducts from "./components/ShowProducts";
import EditProduct from "./components/EditProduct";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Navbar />
				<Switch>
					<Route exact path="/" component={Home} />

					<Route exact path="/addProduct" component={AddProduct} />

					<Route exact path="/login" component={Login} />

					<Route exact path="/register" component={Register} />

					<Route exact path="/productList" component={ShowProducts} />

					<Route
						exact
						path="/editProduct/:id"
						component={EditProduct}
					/>
				</Switch>
				<div class="footer">
					<a href="https://github.com/SatvikNema/amazon-price-tracker">
						<p>View source on githuhb</p>
					</a>
				</div>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
