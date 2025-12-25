import Header from "src/modules/common/components/Header";
import PageLayout from "src/ui/components/PageLayout";
import { Spinner } from "src/ui/components/Spinner";
import { useGetShopItemsQuery } from "../api/shop";
import { ShopCard } from "../components/ShopCard";

// const goods = [
//   { id: 1, title: "Swap", price: 2000 },
//   { id: 2, title: "Full swap", price: 3500 },
//   { id: 3, title: "Black screen", price: 1200 },
//   { id: 4, title: "The Fool", price: 700 },
// ];

const ShopPage = () => {
  const { data: goods, isLoading } = useGetShopItemsQuery();

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header title="Shop" backPath="/" />
      </PageLayout.Header>
      <PageLayout.Body className="p-4 ">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" label="Loading shop…" />
          </div>
        )}
        {!isLoading && goods && (
          <div className="p-4 grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {goods.map((item) => (
              <ShopCard
                key={item.id}
                title={item.title}
                price={item.price}
                imageSrc="https://randomfox.ca/images/51.jpg"
                onBuy={() => console.log("Buy", item.id)}
              />
            ))}
          </div>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ShopPage;
