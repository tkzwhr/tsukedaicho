use fern::colors::{Color, ColoredLevelConfig};

use crate::BoxedError;

pub fn init() -> Result<(), BoxedError> {
    let colors_level = ColoredLevelConfig::new().info(Color::Blue);
    let log_level = if cfg!(debug_assertions) { log::LevelFilter::Debug } else { log::LevelFilter::Info };
    fern::Dispatch::new()
        .format(move |out, message, record| {
            out.finish(format_args!(
                "{}[{}][{}] {}{}\x1B[0m",
                chrono::Local::now().format("[%Y-%m-%d][%H:%M:%S]"),
                record.target(),
                colors_level.color(record.level()),
                format_args!(
                    "\x1B[{}m",
                    colors_level.get_color(&record.level()).to_fg_str()
                ),
                message
            ))
        })
        .level(log_level)
        .level_for("slack_morphism", log::LevelFilter::Info)
        .level_for("axum", log::LevelFilter::Info)
        .level_for("rustls", log::LevelFilter::Info)
        .chain(std::io::stdout())
        .apply()?;

    Ok(())
}
