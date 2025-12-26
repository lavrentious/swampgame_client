import MainLayout from "src/modules/common/components/MainLayout";
import { Spinner } from "src/ui/components/Spinner";
import { useGetShopItemsQuery } from "../api/shop";
import { ShopCard } from "../components/ShopCard";

const ShopPage = () => {
  const { data: goods, isLoading } = useGetShopItemsQuery();

  return (
    <MainLayout title="Shop" showBackButton backPath="/">
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" label="Loading shop…" />
        </div>
      )}

      {/* Content */}
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
    </MainLayout>
  );
};

export default ShopPage;
