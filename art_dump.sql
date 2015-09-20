--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: artist; Type: TABLE; Schema: public; Owner: xyz; Tablespace: 
--

CREATE TABLE artist (
    id integer NOT NULL,
    name character varying(40) NOT NULL,
    years character varying(40)
);


ALTER TABLE public.artist OWNER TO xyz;

--
-- Name: artist_id_seq; Type: SEQUENCE; Schema: public; Owner: xyz
--

CREATE SEQUENCE artist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artist_id_seq OWNER TO xyz;

--
-- Name: artist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xyz
--

ALTER SEQUENCE artist_id_seq OWNED BY artist.id;


--
-- Name: work; Type: TABLE; Schema: public; Owner: xyz; Tablespace: 
--

CREATE TABLE work (
    id integer NOT NULL,
    artist_id integer,
    year character varying(40),
    url character varying(200),
    title character varying(200)
);


ALTER TABLE public.work OWNER TO xyz;

--
-- Name: work_id_seq; Type: SEQUENCE; Schema: public; Owner: xyz
--

CREATE SEQUENCE work_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_id_seq OWNER TO xyz;

--
-- Name: work_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xyz
--

ALTER SEQUENCE work_id_seq OWNED BY work.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xyz
--

ALTER TABLE ONLY artist ALTER COLUMN id SET DEFAULT nextval('artist_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xyz
--

ALTER TABLE ONLY work ALTER COLUMN id SET DEFAULT nextval('work_id_seq'::regclass);


--
-- Data for Name: artist; Type: TABLE DATA; Schema: public; Owner: xyz
--

COPY artist (id, name, years) FROM stdin;
132	Paul CEzanne	
3	Henri Matisse	1869 - 1954
2	Paul Cezanne	1839 - 1906
4	Thomas Moran	1837-1926
119	timma2	2000
104	timms	2000
157	kent	23
1	Vincent Van Gogh	1853 - 1890
160		
126	ken	2000
129	kittens!	20
\.


--
-- Name: artist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: xyz
--

SELECT pg_catalog.setval('artist_id_seq', 160, true);


--
-- Data for Name: work; Type: TABLE DATA; Schema: public; Owner: xyz
--

COPY work (id, artist_id, year, url, title) FROM stdin;
1	3	1912	http://www.artionado.com/Matisse/Images/Matisse/Matisse-Goldfish.jpg	The Goldfish
4	3	1916	http://uploads5.wikiart.org/images/henri-matisse/apples-on-a-table-green-background-1916.jpg	Apples on a Table
5	4	1904	https://upload.wikimedia.org/wikipedia/commons/0/0d/Moran%2C_Thomas_-_Grand_Canyon_of_the_Yellowstone%2C_1904.jpg	Grand Canyon of the Yellow Stone
9	4	1898	https://upload.wikimedia.org/wikipedia/commons/c/c1/Venice_Thomas_Moran_1898.jpeg	Venice
3	1	1890	http://www.scaruffi.com/museums/vangogh/vg4.jpg	Village Street in Auvers
24	3	1904	http://www.metmuseum.org/exhibitions/listings/2012/matisse/~/media/Images/Exhibitions/2012/Matisse/highlights/Matisse_6.ashx	 Still Life with Purro I
25	3	1952	http://macaulay.cuny.edu/eportfolios/drabik14/files/2014/12/henri-matisse-cutout.jpg	The Parakeet and the Mermaid
26	2	1874 - 1875	https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Paul_Cézanne_004.jpg/800px-Paul_Cézanne_004.jpg	Bathers
33	2	1895 -1900	http://www.ibiblio.org/wm/paint/auth/cezanne/land/foliage.jpg	Foliage
2	2	1895	http://uploads1.wikiart.org/images/paul-cezanne/maison-maria-with-a-view-of-chateau-noir-1895.jpg	Maison Maria with a View of Chateau Noir
\.


--
-- Name: work_id_seq; Type: SEQUENCE SET; Schema: public; Owner: xyz
--

SELECT pg_catalog.setval('work_id_seq', 46, true);


--
-- Name: artist_name_key; Type: CONSTRAINT; Schema: public; Owner: xyz; Tablespace: 
--

ALTER TABLE ONLY artist
    ADD CONSTRAINT artist_name_key UNIQUE (name);


--
-- Name: artist_pkey; Type: CONSTRAINT; Schema: public; Owner: xyz; Tablespace: 
--

ALTER TABLE ONLY artist
    ADD CONSTRAINT artist_pkey PRIMARY KEY (id);


--
-- Name: work_pkey; Type: CONSTRAINT; Schema: public; Owner: xyz; Tablespace: 
--

ALTER TABLE ONLY work
    ADD CONSTRAINT work_pkey PRIMARY KEY (id);


--
-- Name: work_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xyz
--

ALTER TABLE ONLY work
    ADD CONSTRAINT work_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES artist(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: xyz
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM xyz;
GRANT ALL ON SCHEMA public TO xyz;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

