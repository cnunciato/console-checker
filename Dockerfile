FROM cypress/included:3.4.1

WORKDIR /app

ADD cypress ./cypress/
COPY cypress.json ./

ENTRYPOINT ["cypress", "run"]
