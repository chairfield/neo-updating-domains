START n=node(*) DETACH DELETE n;
create constraint on (n:Address) assert n.domain is unique;
LOAD CSV FROM 'https://gist.githubusercontent.com/chairfield/64e83b1df034eff003fd3e3ebce910c2/raw/0545d1fc35d8bc1794de48906fa1ef058a012d8c/domains-ips-top-10k.csv' as line CREATE (:Address {domain: line[1], ip: line[2]});
//start a=node(*),b=node(*) with a, b where id(a) <> id(b) and rand() < .0001 and not (a)--(b) with a, b merge (a)-[:LinksTo]->(b);

