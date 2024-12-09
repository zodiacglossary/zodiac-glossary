{ pkgs ? import <nixpkgs> {} }:
let
  port = 15432;
in
pkgs.mkShell {
  packages = [
    pkgs.flyctl
    pkgs.postgresql
    pkgs.dbeaver-bin
    pkgs.nodejs
    (pkgs.python3.withPackages (py: [py.psycopg2 py.jupyter py.pandas py.matplotlib py.sqlalchemy py.networkx]))
    (pkgs.writers.writeDashBin "zodiac-proxy" ''
      ${pkgs.flyctl}/bin/flyctl proxy ${toString port}:5432 -a zodiac-db
    '')
    (pkgs.writers.writeDashBin "zodiac-psql" ''
      ${pkgs.postgresql}/bin/psql "host=localhost port=${toString port} dbname=zodiac user=zodiac password=$(pass work/zodiac/postgresql)" "$@"
    '')
  ];

  shellHook = ''
    export PATH=$PATH:node_modules/.bin NODE_OPTIONS=--openssl-legacy-provider
  '';
}
