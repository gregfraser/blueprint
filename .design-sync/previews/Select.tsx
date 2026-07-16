import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
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

const renderFilm = (film: Film, { handleClick, handleFocus, modifiers }: any) =>
    modifiers.matchesPredicate ? (
        <MenuItem
            key={film.title}
            active={modifiers.active}
            disabled={modifiers.disabled}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            text={`${film.title} (${film.year})`}
        />
    ) : null;

const filterFilm = (query: string, film: Film) =>
    `${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;

export function Default() {
    const [selected, setSelected] = useState<Film>(FILMS[0]);
    return (
        <Select<Film>
            items={FILMS}
            itemRenderer={renderFilm}
            itemPredicate={filterFilm}
            onItemSelect={setSelected}
            filterable={true}
        >
            <Button text={selected.title} rightIcon="caret-down" />
        </Select>
    );
}

export function Fill() {
    const [selected, setSelected] = useState<Film>(FILMS[1]);
    return (
        <Select<Film>
            items={FILMS}
            itemRenderer={renderFilm}
            itemPredicate={filterFilm}
            onItemSelect={setSelected}
            filterable={true}
            fill={true}
        >
            <Button text={selected.title} rightIcon="caret-down" fill={true} alignText="start" />
        </Select>
    );
}
