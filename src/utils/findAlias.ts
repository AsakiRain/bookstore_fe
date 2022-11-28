const dict = {
  author: '作者',
  publisher: '出版社',
  publish_at: '出版年',
  page: '页数',
  price: '定价',
  binding: '装帧',
  isbn: 'ISBN',
  intro: '内容简介',
  cover: '封面',
  series: '丛书',
  translator: '译者',
  original_title: '原作名',
  producer: '出品方',
  id: 'ID',
  title: '书名',
  url: '链接',
  rating: '评分',
  rating_people: '评分人数'
};

const findAlias = (key: string) => {
  // @ts-ignore
  return dict[key] || key;
};

export default findAlias;