import React, {useState} from 'react';
import {View, Text, FlatList, NativeModules} from 'react-native';
import {useProduct} from '../hooks/useProduct';
import {Card, Modal, Portal, Button, Provider} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

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
      <Card.Title title={item.name} titleStyle={{color: 'black'}} />
      <Card.Content>
        <Text style={styles.title}>Price: {item.product_detail.price}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <Text style={styles.text}>Error: {error.message}</Text>;
    } else {
      return <Text style={styles.text}>An unknown error occurred.</Text>;
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
            contentContainerStyle={styles.flatlist}
          />
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            {selectedProduct && (
              <Card style={styles.modal_container}>
                <Card.Title
                  title={selectedProduct.name}
                  titleStyle={{color: 'black'}}
                />
                <Card.Content>
                  <Text style={styles.text}>
                    Price: {selectedProduct.product_detail.price}
                  </Text>
                  <Text style={styles.text}>
                    Stock: {selectedProduct.stock}
                  </Text>
                  <Text style={styles.text}>
                    Description: {selectedProduct.product_detail.description}
                  </Text>
                  <Text style={styles.text}>
                    Color: {selectedProduct.product_detail.color}
                  </Text>
                  <LottieView
                    source={require('./../assets/ar-lottie.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                  />
                  <Button style={styles.button} onPress={openARViewer}>
                    Open AR Viewer
                  </Button>
                </Card.Content>
              </Card>
            )}
            <Button style={styles.button} onPress={hideModal}>
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#253d5b',
  },
  flatlist: {
    padding: 10,
    backgroundColor: '#253d5b',
  },
  item: {
    backgroundColor: '#C2ECFF',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  modal_container: {
    backgroundColor: '#C2ECFF',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    color: '#253d5b',
  },
  text: {
    fontSize: 16,
    color: '#253d5b',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#8f95d3',
    color: '#C2ECFF',
    borderRadius: 10,
    margin: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});
