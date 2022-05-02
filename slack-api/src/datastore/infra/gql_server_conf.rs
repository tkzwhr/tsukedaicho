use shaku::Component;

use crate::datastore::GQLServerConf;

#[derive(Component)]
#[shaku(interface = GQLServerConf)]
pub struct GQLServerConfImpl {
    url: String,
    secret: String,
}

impl GQLServerConf for GQLServerConfImpl {
    fn url(&self) -> String {
        self.url.clone()
    }
    fn secret(&self) -> String {
        self.secret.clone()
    }
}
