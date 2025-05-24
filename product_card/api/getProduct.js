export function getProduct() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.5;

      if (shouldFail) {
        reject("بارگیری اطلاعات محصول با مشکل مواجه شد، دوباره تلاش کنید");
      } else {
        const isInStock = Math.random() < 0.5;
        resolve({
          title: "ساعت کاسیو ادیفایس",
          price: "25.000.000 تومان",
          description: "با این ساعت همه تو را دوست خواهند داشت",
          imgUrl: "assets/watch.png",
          rating: 4.5,
          sold: 120,
          inStock: isInStock,
          brand: "Casio",
          category: "ساعت مچی",
        });
      }
    }, 1200);
  });
}
