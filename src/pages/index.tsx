import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { animate, motion, useMotionValue, useWillChange } from "framer-motion";

interface Pokemon {
  id: string;
  name: string;
  dropPercent: number;
  rarity: string;
  image: string;
}

const pokemon: Pokemon[] = [
  {
    id: "1",
    name: "Bulbasaur",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    id: "2",
    name: "Ivysaur",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
  },
  {
    id: "3",
    name: "Venusaur",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
  },
  {
    id: "4",
    name: "Charmander",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  },
  {
    id: "5",
    name: "Zigzagoon Galar",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10174.png",
  },
  {
    id: "6",
    name: "Linoone Galar",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10175.png",
  },
  {
    id: "7",
    name: "Raikou",
    dropPercent: 79.92,
    rarity: "rare",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png",
  },
  {
    id: "8",
    name: "Entei",
    dropPercent: 15.98,
    rarity: "mythical",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png",
  },
  {
    id: "9",
    name: "Larvitar",
    dropPercent: 15.98,
    rarity: "mythical",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png",
  },
  {
    id: "10",
    name: "Pupitar",
    dropPercent: 15.98,
    rarity: "mythical",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png",
  },
  {
    id: "11",
    name: "Tiranitar",
    dropPercent: 15.98,
    rarity: "mythical",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png",
  },
  {
    id: "12",
    name: "Lugia",
    dropPercent: 15.98,
    rarity: "mythical",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png",
  },
  {
    id: "13",
    name: "Salandit",
    dropPercent: 3.2,
    rarity: "legendary",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png",
  },
  {
    id: "14",
    name: "Salazzle",
    dropPercent: 3.2,
    rarity: "legendary",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png",
  },
  {
    id: "15",
    name: "Iron Valiant",
    dropPercent: 3.2,
    rarity: "legendary",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1006.png",
  },
  {
    id: "16",
    name: "Joltik",
    dropPercent: 0.64,
    rarity: "ancient",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/595.png",
  },
  {
    id: "17",
    name: "Maschiff",
    dropPercent: 0.64,
    rarity: "ancient",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/942.png",
  },
  {
    id: "18",
    name: "Mabossiff",
    dropPercent: 0.26,
    rarity: "spiritual",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/943.png",
  },
];

const drop = (items: Pokemon[]) => {
  let chances = [];

  const sum = items.reduce((prev, curr) => prev + curr.dropPercent, 0);

  let acc = 0;
  chances = items.map(({ dropPercent }) => (acc = dropPercent + acc));

  const rand = Math.random() * sum;

  const itemIndex = chances.filter((el) => el <= rand).length;

  const result = items.find((_, index) => index === itemIndex);

  return result;
};

function random(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  const x = useMotionValue(0);
  const willChange = useWillChange();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
  const [spinItems, setSpinItems] = useState<Pokemon[]>([]);
  const [spinning, setSpinning] = useState(false);

  const onClick = () => {
    if (spinning) return;

    setSpinning(true);

    const selected = drop(pokemon);

    const shuffleItems = shuffle([
      ...pokemon,
      ...pokemon,
      ...pokemon,
      ...pokemon,
      ...pokemon,
    ]);

    shuffleItems[83] = selected;

    setSpinItems(shuffleItems);

    animate(x, random(-14980, -15140), {
      ease: [0.2, 0, 0.6, 1],
      duration: 2,
      onComplete: () => {
        setTimeout(() => {
          setSelectedPokemon(selected);
          setSpinning(false);
          x.set(0);
        }, 8500);
      },
    });
  };

  return (
    <div className={styles.container}>
      {pokemon.map((pokemon, index) => (
        <div key={pokemon.id} className={styles.pokemon}>
          <div className={styles.image}>
            <img src={pokemon.image} width="180px" height="150px" />
          </div>
          <div
            className={`${styles.text} ${
              styles[pokemon.rarity] || styles.default
            }`}
          >
            {pokemon.name} {index}
          </div>
        </div>
      ))}
      <div className={styles.list}>
        <div
          className={styles.holder}
          style={{ display: spinning ? "block" : "none" }}
        >
          <motion.div style={{ x, willChange }} className={styles.roller}>
            {spinItems.map((pokemon, index) => (
              <div key={pokemon.id} className={styles.pokemon}>
                <div className={styles.image}>
                  <img src={pokemon.image} width="180px" height="150px" />
                </div>
                <div
                  className={`${styles.text} ${
                    styles[pokemon.rarity] || styles.default
                  }`}
                >
                  {pokemon.name} {index}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <button onClick={onClick}>Open</button>
      <div>You get: {selectedPokemon?.name}</div>
    </div>
  );
}
