import { MenuItem, Tag } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import { useState } from "react";

interface Film {
    title: string;
    year: number;
}

const FILMS: Film[] = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Dark Knight", year: 2008 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "Schindler's List", year: 1993 },
    { title: "Inception", year: 2010 },
];

const renderFilm = (film: Film, { handleClick, handleFocus, modifiers, selected }: any) =>
    modifiers.matchesPredicate ? (
        <MenuItem
            key={film.title}
            active={modifiers.active}
            icon={selected ? "tick" : "blank"}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            selected={selected}
            text={`${film.title} (${film.year})`}
        />
    ) : null;

const filterFilm = (query: string, film: Film) =>
    `${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;

export function Default() {
    const [selected, setSelected] = useState<Film[]>([FILMS[0], FILMS[2]]);
    const toggle = (film: Film) =>
        setSelected(prev => (prev.includes(film) ? prev.filter(f => f !== film) : [...prev, film]));
    return (
        <MultiSelect<Film>
            items={FILMS}
            selectedItems={selected}
            itemRenderer={renderFilm}
            itemPredicate={filterFilm}
            onItemSelect={toggle}
            onRemove={toggle}
            tagRenderer={film => film.title}
            placeholder="Search films..."
        />
    );
}

export function Empty() {
    return (
        <MultiSelect<Film>
            items={FILMS}
            selectedItems={[]}
            itemRenderer={renderFilm}
            itemPredicate={filterFilm}
            onItemSelect={() => {}}
            tagRenderer={film => film.title}
            placeholder="Search films..."
        />
    );
}
