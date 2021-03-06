import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stuff: [],
			selectedCard: null,
			selectedName: "",
			favoritesList: []
		};
		this.getDataFromUrl = this.getDataFromUrl.bind(this);
		this.postUserCardToTheServer = this.postUserCardToTheServer.bind(this);
		this.getFavoritesFromServer = this.getFavoritesFromServer.bind(this);
	}

	componentDidMount() {
		this.getDataFromUrl();
		this.getFavoritesFromServer();
	}

	setCard(card) {
		this.setState({
			selectedCard: card.imageUrl,
			selectedName: card.name
		});
	}

	getDataFromUrl() {
		axios.get("https://api.pokemontcg.io/v1/cards").then((response) => {
			this.setState({
				stuff: response.data.cards
			});
		});
	}

	getFavoritesFromServer() {
		axios.get("/api/favorites").then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	postUserCardToTheServer() {
		const savedCard = {
			imageUrl: this.state.selectedCard,
			name: this.state.selectedName
		};
		axios.post("/api/favorites", savedCard).then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	updateFavorite(id) {
		const updatedCard = {
			imageUrl: this.state.selectedCard,
			name: this.state.selectedName
		};
		axios.put(`/api/favorites/${id}`, updatedCard).then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	render() {
		const { stuff, favoritesList } = this.state;

		const myCards = stuff.length ? (
			stuff.map((card) => {
				return (
					<img
						onClick={() => {
							this.setCard(card);
						}}
						src={card.imageUrl}
					/>
				);
			})
		) : (
			<img src="https://media1.giphy.com/media/jM4bWFBKpSFeo/giphy.gif?cid=3640f6095bfed28252686834774bbc44" />
		);

		const myFavorites = favoritesList.map((card) => {
			return (
				<span>
					<img src={card.imageUrl} />
					<button onClick={() => this.updateFavorite(card.id)}>
						update with selected
					</button>
				</span>
			);
		});

		return (
			<div className="App">
				<div>
					<div>{myFavorites}</div>
					<img src={this.state.selectedCard} />
					<button onClick={() => this.postUserCardToTheServer()}>
						ADD
					</button>
				</div>
				{myCards}
			</div>
		);
	}
}

export default App;
