#!/bin/bash
VERSION="v1.0.0"
git tag -a $VERSION -m "Release NuVida v1.0.0"
git push origin $VERSION
echo "Creamos el tag de release en Git"
