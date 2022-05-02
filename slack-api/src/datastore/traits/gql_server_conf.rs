use shaku::Interface;

pub trait GQLServerConf: Interface {
    fn url(&self) -> String;
    fn secret(&self) -> String;
}
