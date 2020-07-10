# EasyDAI Subgraph

## Setup

### Prerequisites

* Global Yarn Packages
  * ganache-cli
  * truffle
  * graph-cli
* Docker 

### Services

Start a ganache chain using 0.0.0.0 as a host so docker can connect

```
ganache-cli -h 0.0.0.0 -d -l 4294967295 --allowUnlimitedContractSize
```

Run a local graph node

```
git clone https://github.com/graphprotocol/graph-node/
```

Update ethereum value in docker-compose.yml to ganache:http://host.docker.internal:8545

```
cd graph-node/docker
docker-compose up
```

To blow away graph-node settings

```
docker-compose kill && docker-compose rm -f && rm -rf data
```


### Subgraph

Clone the balancer subgraph

```
git clone git@github.com:balancer-labs/balancer-subgraph.git
```

Update factory address in subgraph.yaml to the one listed as part of the deploy

Install dependencies

```
yarn
```

Generate the graph code

```
yarn codegen
```

Create local node

```
yarn create:local
```

Deploy locally

```
yarn deploy:local
```

Any updates can be made to this repo and re-running yarn deploy:local without needing to re-initialize the environment.
