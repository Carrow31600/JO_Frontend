import { Container } from "react-bootstrap";
import Cover from "../components/Home/cover";
import CarouselLieux from "../components/Home/CarouselLieux";
import CarouselSports from "../components/Home/CarouselSports";
import coverImage from "../assets/cover.png";

export default function HomePage() {
  return (
    <div>
      {/* Section Cover */}
      <Cover 
  image={coverImage} 
  title="Bienvenue sur la plateforme officielle de billetterie des Jeux Olympiques de Paris 2024 !"
>
  <p>
    L’aventure olympique s’apprête à illuminer la capitale française et toute la France. 
    Paris 2024 promet des moments inoubliables, où le sport, l’émotion et l’excellence se rencontreront pour célébrer l’unité et la passion.
  </p>
  <p>
    Que vous soyez fan de sport, amateur de sensations fortes ou simplement curieux de vivre l’histoire en direct, 
    les Jeux Olympiques sont une expérience unique à ne pas manquer.
  </p>
  <p>
    Découvrez dès maintenant nos offres de billets pour assister aux compétitions les plus attendues, 
    des cérémonies d’ouverture et de clôture aux épreuves mythiques qui feront vibrer les stades et les cœurs.
  </p>
  <p>
    Réservez votre place pour être au cœur de l’action et partager des souvenirs exceptionnels avec le monde entier. 
    Ne laissez pas passer votre chance : les billets sont en vente, et l’histoire s’écrira sous vos yeux. 
    Paris 2024, prêts pour l’émotion ?
  </p>
</Cover>

      <Container className="my-5">
        {/* Carrousel des lieux */}
        <h2 className="mb-4">Découvrez les sites sur lesquels se tiendront les JO</h2>
        <CarouselLieux />

        {/* Carrousel des sports */}
        <h2 className="mt-5 mb-4">Parcourez les sports ...</h2>
        <CarouselSports />
      </Container>
    </div>
  );
}
