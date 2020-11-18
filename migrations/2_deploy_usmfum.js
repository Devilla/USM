const WETH9 = artifacts.require('WETH9')
const MockAggregator = artifacts.require('MockChainlinkAggregatorV3')
const MockUniswapAnchoredView = artifacts.require('MockUniswapAnchoredView')
const MockUniswapV2Pair = artifacts.require('MockUniswapV2Pair')
const USM = artifacts.require('USM')

module.exports = async function(deployer, network) {
    
    const chainlinkAddresses = {
        'mainnet' : '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
        'mainnet-ganache' : '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
    }
    const compoundAddresses = {
        'mainnet' : '0x922018674c12a7f0d394ebeef9b58f186cde13c1',
        'mainnet-ganache' : '0x922018674c12a7f0d394ebeef9b58f186cde13c1'
    }
    const ethUsdtAddresses = {
        'mainnet' : '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        'mainnet-ganache' : '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852'
    }
    const usdcEthAddresses = {
        'mainnet' : '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        'mainnet-ganache' : '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'
    }
    const daiEthAddresses = {
        'mainnet' : '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
        'mainnet-ganache' : '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'
    }
    const wethAddresses = {
        'mainnet' : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'mainnet-ganache' : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    }

    const e30 = '1000000000000000000000000000000'
    const e18 = '1000000000000000000'
    let weth, aggregator, anchoredView, ethUsdtPair, usdcEthPair, daiEthPair
    let wethAddress, aggregatorAddress, anchoredViewAddress, ethUsdtPairAddress, usdcEthPairAddress, daiEthPairAddress
    const uniswapTokensInReverseOrder = [false, true, true]   // See UniswapMedianOracle
    const uniswapScaleFactors = [e30, e30, e18]               // See UniswapMedianOracle

    if (network === 'development') {
        await deployer.deploy(WETH9);
        weth = await WETH9.deployed()
        wethAddress = weth.address

        const chainlinkPrice = '38598000000' // 8 dec places: see ChainlinkOracle
        const compoundPrice = '414174999' // 6 dec places: see CompoundOpenOracle
      
        const ethUsdtReserve0 = '646310144553926227215994'
        const ethUsdtReserve1 = '254384028636585'
      
        const usdcEthReserve0 = '260787673159143'
        const usdcEthReserve1 = '696170744128378724814084'
      
        const daiEthReserve0 = '178617913077721329213551886'
        const daiEthReserve1 = '480578265664207487333589'

        await deployer.deploy(MockAggregator)
        aggregator = await MockAggregator.deployed()
        await aggregator.set(chainlinkPrice)
        aggregatorAddress = aggregator.address
    
        await deployer.deploy(MockUniswapAnchoredView)
        anchoredView = await MockUniswapAnchoredView.deployed()
        await anchoredView.set(compoundPrice)
        anchoredViewAddress = anchoredView.address
    
        await deployer.deploy(MockUniswapV2Pair)
        ethUsdtPair = await MockUniswapV2Pair.deployed()
        await ethUsdtPair.set(ethUsdtReserve0, ethUsdtReserve1)
        ethUsdtPairAddress = ethUsdtPair.address
  
        await deployer.deploy(MockUniswapV2Pair)
        usdcEthPair = await MockUniswapV2Pair.deployed()
        await usdcEthPair.set(usdcEthReserve0, usdcEthReserve1)
        usdcEthPairAddress = usdcEthPair.address
  
        await deployer.deploy(MockUniswapV2Pair)
        daiEthPair = await MockUniswapV2Pair.deployed()
        await daiEthPair.set(daiEthReserve0, daiEthReserve1)
        daiEthPairAddress = daiEthPair.address
    }
    else {
        wethAddress = wethAddresses[network]
        aggregatorAddress = chainlinkAddresses[network]
        anchoredViewAddress = compoundAddresses[network]
        ethUsdtPairAddress = ethUsdtAddresses[network]
        usdcEthPairAddress = usdcEthAddresses[network]
        daiEthPairAddress = daiEthAddresses[network]
    }

    await deployer.deploy(
        USM,
        wethAddress, aggregatorAddress, anchoredViewAddress,
        [ethUsdtPairAddress, usdcEthPairAddress, daiEthPairAddress],
        uniswapTokensInReverseOrder, uniswapScaleFactors
    )
}
