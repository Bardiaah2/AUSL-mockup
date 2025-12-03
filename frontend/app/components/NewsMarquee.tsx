const newsTicker = [
  "Spark and Cascade expansion draft slots confirmed.",
  "Allocation pool highlighted by Jocelyn Alo’s return to AU.",
  "Savanna Collins spotlights Maya Brady and Syd McKinney for expansion teams.",
  "MLB Network showcases AUSL award winners at 9 PM ET.",
];

function NewsMarquee() {
  return (
    <section className="news-marquee">
      <div className="news-marquee__track">
        {newsTicker.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

export default NewsMarquee;