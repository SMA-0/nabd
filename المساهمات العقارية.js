import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const properties = [
  {
    id: 1,
    name: "فيلا الرياض الفاخرة",
    location: "الرياض",
    image: "villa.jpg",
    sharesAvailable: 200,
    pricePerShare: "0.5 ETH",
    roi: "7.2%",
    nftId: "NFT12345",
  },
  {
    id: 2,
    name: "برج جدة السكني",
    location: "جدة",
    image: "tower.jpg",
    sharesAvailable: 150,
    pricePerShare: "0.7 ETH",
    roi: "8.4%",
    nftId: "NFT67890",
  },
];

function Marketplace() {
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setFilteredProperties(
      properties.filter((prop) =>
        prop.location.includes(filter) || prop.name.includes(filter)
      )
    );
  }, [filter]);

  const handlePurchase = async (property) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contractAddress = "0xYourContractAddress";
      const abi = ["function buyShare(uint256 nftId) external payable"];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.buyShare(property.nftId, {
        value: ethers.utils.parseEther(property.pricePerShare.replace(" ETH", "")),
      });

      await tx.wait();
      alert("تم شراء الحصة بنجاح وتم تسجيل المعاملة على البلوكشين.");
    } else {
      alert("يرجى تثبيت محفظة MetaMask أو محفظة تدعم Web3.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">سوق المساهمات العقارية اللامركزية</h1>
        <input
          type="text"
          placeholder="ابحث عن عقار..."
          className="w-full mb-8 p-3 rounded shadow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={property.image} alt={property.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold">{property.name}</h2>
                <p className="text-gray-600">{property.location}</p>
                <p className="mt-2">الأسهم المتاحة: {property.sharesAvailable}</p>
                <p>السعر للسهم الواحد: {property.pricePerShare}</p>
                <p>العائد المتوقع: {property.roi}</p>
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => handlePurchase(property)}
                >
                  شراء حصة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
