import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, NativeModules} from 'react-native';
import {useProduct} from '../hooks/useProduct';
import {
  Card,
  Modal,
  Portal,
  Button,
  Provider,
  IconButton,
} from 'react-native-paper';

type Product = {
  id: number;
  name: string;
  product_detail: {
    price: number;
    description: string;
    color: string;
  };
  stock: number;
};

export default function ProductsScreen() {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {data: products, isSuccess, isError, error, isLoading} = useProduct();

  const showModal = (product: Product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const renderItem = ({item}: {item: Product}) => (
    <Card style={styles.item} onPress={() => showModal(item)}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text style={styles.title}>Price: {item.product_detail.price}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <Text>Error: {error.message}</Text>;
    } else {
      return <Text>An unknown error occurred.</Text>;
    }
  }
  const openARViewer = () => {
    NativeModules.ARModule.openViewer(
      'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      'Astronaut',
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        {isSuccess && (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            {selectedProduct && (
              <Card style={styles.modal_container}>
                <Card.Title title={selectedProduct.name} />
                <Card.Content>
                  <Text>Price: {selectedProduct.product_detail.price}</Text>
                  <Text>Stock: {selectedProduct.stock}</Text>
                  <Text>
                    Description: {selectedProduct.product_detail.description}
                  </Text>
                  <Text>Color: {selectedProduct.product_detail.color}</Text>
                  <IconButton icon="camera" onPress={openARViewer} />
                </Card.Content>
              </Card>
            )}
            <Button onPress={hideModal}>Close</Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  modal_container: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
