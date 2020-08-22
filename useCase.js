const { default: Axios } = require('axios');

async function main() {
  const res = await Axios.get('https://github.com/users/itizawa/contributions');
  const grassElement = res.data.toString().match(/<rect(?: [\s\S]+?)?\/>/g);
  const grasses = grassElement.map((x) => {
    return { data_date: x.split(' ')[8].slice(11, 21), data_count: Number(x.split(' ')[7].split('"').join('').slice(11)) };
  }).reverse();
  console.log(grasses[0].data_count);

}


main();
