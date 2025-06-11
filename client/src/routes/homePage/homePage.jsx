import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";

function HomePage() {
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p>
          <b>Real-State Seeker </b> helps you find the perfect home to buy or rent. 
          Browse a wide range of properties, 
          explore locations with <b>interactive maps</b>,and make confident decisions—all in one place.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1> 🏡</h1>
              <h2>modern apartments</h2>
            </div>
            <div className="box">
              <h1> 🌆</h1>
              <h2>Stylish city </h2>
            </div>
            <div className="box">
              <h1> 🌳</h1>
              <h2> greenery places</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
